CREATE TABLE IF NOT EXISTS media (
                                     id uuid DEFAULT uuid_generate_v4 (),
                                     "storage" VARCHAR (10) NOT NULL CHECK ("storage" <> ''),
                                     "type" VARCHAR (10) NOT NULL CHECK ("type" <> ''),
                                     filename VARCHAR (1000) DEFAULT NULL,
                                     link VARCHAR (1000) DEFAULT NULL,
                                     created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                     updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                     PRIMARY KEY (id),
                                     CONSTRAINT md_id_unique UNIQUE (id),
);
