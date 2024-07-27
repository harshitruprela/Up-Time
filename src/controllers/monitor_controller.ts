/** @format */

import { type Request, type Response } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { setTime } from "../..";
//----------------------- Not tested yet -----------------------------------//
export const addMonitor = async (req: Request, res: Response) => {
	const { name, url, method, requestTime } = req.body;

	if (!name || !url) {
		return res.status(400).json({ error: "Invalid body" });
	}

	try {
		await db.transaction(async (trx) => {
			await trx
				.insert(schema.monitors)
				.values({ name, url, method, requestTime });
		});

		res.json({ message: "New monitor added and corresponding stats created" });
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to save new monitor and corresponding stats",
			error: error.message,
		});
	}
};

export const listMonitors = async (req: Request, res: Response) => {
	try {
		const result = await db.select().from(schema.monitors);
		res.json({ message: "Monitor list", results: result });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const editMonitor = async (req: Request, res: Response) => {
	const { name } = req.params;
	const { url, method } = req.body;

	try {
		const result = await db
			.update(schema.monitors)
			.set({ url, method })
			.where(eq(schema.monitors.name, name))
			.returning();

		if (result.length === 0) {
			return res.status(404).json({ error: "Document not found" });
		}

		res.json({ message: "Monitor changes saved", data: result[0] });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};


export const editTimeout = async (req: Request, res: Response) => {
    const { time } = req.params;
	console.log(time)
    try {
		if (!time) {
            throw new Error('Time parameter is missing');
        }
        const Time = parseInt(time);
        if (!isNaN(Time)) {
            // Assuming setTime is defined elsewhere
            setTime(Time);
            res.status(200).json({ timeSet: true });
        } else {
            throw new Error('Invalid time parameter');
        }
    } catch (error : any) {
        res.status(500).json({ chadibanyan : error.message });
    }
}