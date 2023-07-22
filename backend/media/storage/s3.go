package storage

import (
	"bytes"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
	"io"
	"mime/multipart"
	"os"
	"time"
)

type S3Storage struct {
	bucketName      string
	accountId       string
	accessKeyId     string
	accessKeySecret string
	session         *s3.S3
}

// NewS3Storage New will instantiate a new instance of RecordStore.
func NewS3Storage() *S3Storage {
	return &S3Storage{
		bucketName:      os.Getenv("BUCKET_NAME"),
		accountId:       os.Getenv("ACCOUNT_ID"),
		accessKeyId:     os.Getenv("ACCESS_KEY_ID"),
		accessKeySecret: os.Getenv("SECRET_ACCESS_KEY"),
	}
}

func (s *S3Storage) GetLink(objectKeyId string) (string, error) {
	return objectKeyId, nil
}

func (s *S3Storage) GetPresignedURL(objectKeyId string) (string, error) {
	svc, err := s.getSession()
	if err != nil {
		fmt.Println("Failed to create AWS session:", err)
		return "", err
	}
	// Generate a presigned URL with 1-hour expiration
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(s.bucketName),
		Key:    aws.String(objectKeyId),
	})
	return req.Presign(15 * time.Minute)
}

func (s *S3Storage) Upload(file multipart.File, filename string) (string, error) {
	svc, err := s.getSession()
	if err != nil {
		fmt.Println("Failed to create AWS session:", err)
		return "", err
	}

	// Generate a unique key (UUID) for the object
	objectKey := uuid.New().String() + "_" + filename

	// Read the image file into a byte slice (Replace with your file path)
	imageData, err := io.ReadAll(file)
	if err != nil {
		fmt.Println("Failed to read the image file:", err)
		return "", err
	}

	// Upload the image to S3 with the unique key
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(s.bucketName),
		Key:    aws.String(objectKey),
		Body:   bytes.NewReader(imageData),
		ACL:    aws.String("public-read"), // Optional: Sets the object's ACL (Access Control List)
	})

	if err != nil {
		fmt.Println("Failed to upload the image to S3:", err)
		return "", err
	}

	fmt.Println("Image uploaded successfully! Object Key:", objectKey)

	return objectKey, nil
}

func (s *S3Storage) getSession() (*s3.S3, error) {
	if s.session != nil {
		return s.session, nil
	}
	// Replace with your AWS credentials and region
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String("auto"),
		Credentials: credentials.NewStaticCredentials(s.accessKeyId, s.accessKeySecret, ""),
		EndpointResolver: endpoints.ResolverFunc(func(service, region string, opts ...func(*endpoints.Options)) (endpoints.ResolvedEndpoint, error) {
			return endpoints.ResolvedEndpoint{
				URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", s.accountId),
			}, nil
		}),
	})
	if err != nil {
		return nil, err
	}
	// Create an S3 service client
	return s3.New(sess), err
}
