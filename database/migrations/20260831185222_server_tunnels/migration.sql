CREATE TYPE "tunnel_protocol" AS ENUM('TCP', 'UDP');
CREATE SEQUENCE "public"."tunnel_epoch" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;
CREATE TABLE "node_tunnels" (
	"node_uuid" uuid PRIMARY KEY,
	"host" varchar(1020) NOT NULL,
	"port" integer DEFAULT 7100 NOT NULL,
	"cert_sha256" bytea,
	"created" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "server_tunnel_connections" (
	"src_server_uuid" uuid,
	"dst_server_uuid" uuid,
	"created" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "server_tunnel_connections_pk" PRIMARY KEY("src_server_uuid","dst_server_uuid")
);

CREATE TABLE "server_tunnel_ports" (
	"server_uuid" uuid,
	"port" integer,
	"protocols" "tunnel_protocol"[] NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "server_tunnel_ports_pk" PRIMARY KEY("server_uuid","port")
);

CREATE TABLE "server_tunnels" (
	"server_uuid" uuid PRIMARY KEY,
	"idx" integer NOT NULL,
	"name" varchar(63) NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "server_tunnel_connections_src_server_uuid_idx" ON "server_tunnel_connections" ("src_server_uuid");
CREATE INDEX "server_tunnel_connections_dst_server_uuid_idx" ON "server_tunnel_connections" ("dst_server_uuid");
CREATE INDEX "server_tunnel_ports_server_uuid_idx" ON "server_tunnel_ports" ("server_uuid");
CREATE UNIQUE INDEX "server_tunnels_idx_idx" ON "server_tunnels" ("idx");
CREATE UNIQUE INDEX "server_tunnels_name_idx" ON "server_tunnels" ("name");
ALTER TABLE "node_tunnels" ADD CONSTRAINT "node_tunnels_node_uuid_nodes_uuid_fkey" FOREIGN KEY ("node_uuid") REFERENCES "nodes"("uuid") ON DELETE CASCADE;
ALTER TABLE "server_tunnel_connections" ADD CONSTRAINT "server_tunnel_connections_GUC4KbsQrhnz_fkey" FOREIGN KEY ("src_server_uuid") REFERENCES "server_tunnels"("server_uuid") ON DELETE CASCADE;
ALTER TABLE "server_tunnel_connections" ADD CONSTRAINT "server_tunnel_connections_v9hmsXmNskSA_fkey" FOREIGN KEY ("dst_server_uuid") REFERENCES "server_tunnels"("server_uuid") ON DELETE CASCADE;
ALTER TABLE "server_tunnel_ports" ADD CONSTRAINT "server_tunnel_ports_server_uuid_server_tunnels_server_uuid_fkey" FOREIGN KEY ("server_uuid") REFERENCES "server_tunnels"("server_uuid") ON DELETE CASCADE;
ALTER TABLE "server_tunnels" ADD CONSTRAINT "server_tunnels_server_uuid_servers_uuid_fkey" FOREIGN KEY ("server_uuid") REFERENCES "servers"("uuid") ON DELETE CASCADE;