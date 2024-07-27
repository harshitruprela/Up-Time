/** @format */

import { type Request, type Response } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export const addPingStat = async (req: Request, res: Response) => {
	const { statsUrl, latency, status, time } = req.body;
	//console.log(`stats url = ${statsUrl} latency = ${latency} status = ${status} time = ${time}`)
	console.log(
		`stats url = ${statsUrl} latency = ${latency} status = ${status} time = ${time}`
	);
	if (!statsUrl || latency == null || status == null || !time) {
		return res.status(400).json({ error: "Invalid body" });
	}

	try {
		await db
			.insert(schema.stats)
			.values({ statsUrl, latency, status, time });
		res.json({ message: "Ping stat added" });
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to save ping stat",
			error: error.message,
		});
	}
};

export const listPingStats = async (req: Request, res: Response) => {
	try {
		const result = await db.select().from(schema.stats);
		res.json({ message: "Ping stats list", results: result });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const editPingStat = async (req: Request, res: Response) => {
	const { stats_url } = req.params;
	const { latency, status, time } = req.body;

	try {
		const result = await db
			.update(schema.stats)
			.set({ latency, status, time })
			.where(eq(schema.stats.statsUrl, stats_url))
			.returning();

		if (result.length === 0) {
			return res.status(404).json({ error: "Document not found" });
		}

		res.json({ message: "Ping stat changes saved", data: result[0] });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const specificPingStat = async (req: Request, res: Response) => {
	const { name } = req.params;

	try {
		const urlResult = await db
			.select({url: schema.monitors.url})
			.from(schema.monitors)
			.where(eq(schema.monitors.name, name));

		if (urlResult.length === 0) {
			return res.status(404).json({ error: "Monitor not found" });
		}

		const {url} = urlResult[0];

		const result = await db
			.select()
			.from(schema.stats)
			.where(eq(schema.stats.statsUrl, url));

		if (result.length === 0) {
			return res.status(404).json({ error: "Document not found" });
		}

		res.json({ message: "Ping stat changes saved", data: result[0] });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};
