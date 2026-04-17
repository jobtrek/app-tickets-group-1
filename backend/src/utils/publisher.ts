import type { Server } from "bun";

let _server: Server<{ ticketId: string | undefined }> | null = null;

export const setServer = (s: Server<{ ticketId: string | undefined }>) => {
	_server = s;
};

export const publish = (channel: string, data: string) => {
	_server?.publish(channel, data);
};

export const getServer = () => _server;
