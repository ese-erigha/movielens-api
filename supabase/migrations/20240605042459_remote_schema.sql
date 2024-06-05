
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."cbr_predictions" (
    "id" integer NOT NULL,
    "movie_id" integer NOT NULL,
    "sim_movie_id" integer NOT NULL,
    "score" numeric(5,2) NOT NULL
);

ALTER TABLE "public"."cbr_predictions" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."cbr_predictions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."cbr_predictions_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."cbr_predictions_id_seq" OWNED BY "public"."cbr_predictions"."id";

CREATE TABLE IF NOT EXISTS "public"."movies" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "genres" character varying(255) NOT NULL,
    "tmdb_id" integer NOT NULL,
    "average_rating" numeric(5,2) NOT NULL
);

ALTER TABLE "public"."movies" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."svd_predictions" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "movie_id" integer NOT NULL,
    "score" numeric(5,2) NOT NULL
);

ALTER TABLE "public"."svd_predictions" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."svd_predictions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."svd_predictions_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."svd_predictions_id_seq" OWNED BY "public"."svd_predictions"."id";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."cbr_predictions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cbr_predictions_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."svd_predictions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."svd_predictions_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."cbr_predictions"
    ADD CONSTRAINT "cbr_predictions_movie_id_sim_movie_id_key" UNIQUE ("movie_id", "sim_movie_id");

ALTER TABLE ONLY "public"."cbr_predictions"
    ADD CONSTRAINT "cbr_predictions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."movies"
    ADD CONSTRAINT "movies_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."svd_predictions"
    ADD CONSTRAINT "svd_predictions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."svd_predictions"
    ADD CONSTRAINT "svd_predictions_user_id_movie_id_key" UNIQUE ("user_id", "movie_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_cbr_predictions_movie_id" ON "public"."cbr_predictions" USING "btree" ("movie_id");

CREATE INDEX "idx_svd_predictions_user_id" ON "public"."svd_predictions" USING "btree" ("user_id");

ALTER TABLE "public"."cbr_predictions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cbr_predictions is viewable by anon" ON "public"."cbr_predictions" FOR SELECT TO "anon" USING (true);

ALTER TABLE "public"."movies" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "movies is viewable by anon" ON "public"."movies" FOR SELECT TO "anon" USING (true);

ALTER TABLE "public"."svd_predictions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "svd_predictions is viewable by anon" ON "public"."svd_predictions" FOR SELECT TO "anon" USING (true);

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users is viewable by anon" ON "public"."users" FOR SELECT TO "anon" USING (true);

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."cbr_predictions" TO "anon";
GRANT ALL ON TABLE "public"."cbr_predictions" TO "authenticated";
GRANT ALL ON TABLE "public"."cbr_predictions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."cbr_predictions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cbr_predictions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cbr_predictions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."movies" TO "anon";
GRANT ALL ON TABLE "public"."movies" TO "authenticated";
GRANT ALL ON TABLE "public"."movies" TO "service_role";

GRANT ALL ON TABLE "public"."svd_predictions" TO "anon";
GRANT ALL ON TABLE "public"."svd_predictions" TO "authenticated";
GRANT ALL ON TABLE "public"."svd_predictions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."svd_predictions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."svd_predictions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."svd_predictions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
