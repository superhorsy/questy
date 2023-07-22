import BlueLine from "@images/intro/line2.png";
import BlueLineMobile from "@images/intro/line_mobile.png";
import Emodji from "@images/intro/emo.png";
import EmodjiMobile from "@images/intro/emodji_mobile.png";
import Image from 'next/image';
import Lamp from "@images/intro/lamp.png";
import LampMobile from "@images/intro/lamp_mobile.png";
import {LoginForm} from "@components/LoginForm/loginForm";
import LogoLight from "@images/intro/logo-light.png";
import LogoMobile from "@images/intro/logo_mobile.png";
import Question from "@images/intro/question.png";
import React from "react";
import SmallQuestion from "@images/intro/question_sm.png";
import SmallQuestionMobile from "@images/intro/question_sm_mobile.png";
import Smile from "@images/intro/smile.png";
import SmileMobile from "@images/intro/smile_mobile.png";
import styles from "./intro.module.scss";
import {useTranslations} from 'next-intl';

const Intro = () => {
    const t = useTranslations("home");
    const tasks = [
        t("intro_task1"),
        t("intro_task2"),
        t("intro_task3"),
        t("intro_task4"),
    ];

    const steps = [
        t("intro_step1"),
        t("intro_step2"),
        t("intro_step3"),
        t("intro_step4"),
    ];

    const images = [
        {
            src: BlueLine,
            alt: "Blue line",
            class: styles.blueLine,
        },
        {
            src: Lamp,
            alt: "Lamp",
            class: styles.lamp,
        },
        {
            src: Emodji,
            alt: "Emodji",
            class: styles.emodji,
        },
        {
            src: Smile,
            alt: "Smile",
            class: styles.smile,
        },
        {
            src: SmallQuestion,
            alt: "?",
            class: styles.smallQuestion,
        },

        {
            src: Question,
            alt: "?",
            class: styles.question,
        },
    ];

    const mobileImages = [
        {
            src: SmileMobile,
            alt: "Smile",
            class: styles.smileMobile,
        },
        {
            src: BlueLineMobile,
            alt: "Blue line",
            class: styles.blueLineMobile,
        },
        {
            src: LampMobile,
            alt: "Lamp",
            class: styles.lampMobile,
        },
        {
            src: EmodjiMobile,
            alt: "Emodji",
            class: styles.emodjiMobile,
        },
        {
            src: SmallQuestionMobile,
            alt: "?",
            class: styles.smallQuestionMobile,
        },
        {
            src: LogoMobile,
            alt: "Questy",
            class: styles.logoMobile,
        },
    ];

    const renderMobileImages = () => {
        return (
            <>
                {mobileImages.map((image, ind) => (
                    <Image
                        className={image.class}
                        key={ind}
                        src={image.src}
                        alt={image.alt}
                    />
                ))}
            </>
        );
    };

    const renderImages = () => {
        return (
            <>
                {images.map((image, ind) => (
                    <Image
                        className={image.class}
                        key={ind}
                        src={image.src}
                        alt={image.alt}
                    />
                ))}
            </>
        );
    };

    const renderTasks = () => {
        return (
            <>
                {tasks.map((task, ind) => (
                    <div className={styles.tasks__item} key={ind}>
                        {task}
                    </div>
                ))}
            </>
        );
    };

    const renderSteps = () => {
        return (
            <>
                {steps.map((step, ind) => (
                    <div className={styles.list__li} key={ind}>
                        {step}
                    </div>
                ))}
            </>
        );
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.intro}>
                <div className={styles.intro__content}>
                    {renderImages()}
                    <div className={styles.intro__left}>
                        {renderMobileImages()}
                        <h1 className={styles.intro__title} dangerouslySetInnerHTML={{__html: t.raw('intro_title')}}/>
                        <Image src={LogoLight} className={styles.intro__logo} alt="Questy"/>

                        <p className={styles.intro__text}>{t("intro_text1")}</p>

                        <div className={styles.tasks}>{renderTasks()}</div>

                        <p className={styles.intro__subtext}>{t("intro_text2")}</p>

                        <div className={styles.list}>{renderSteps()}</div>
                    </div>
                    <div className={styles.intro__right}>
                        <LoginForm/>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Intro
