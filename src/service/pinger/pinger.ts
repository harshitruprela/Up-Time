const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const pinger = async (links: string[]) => {
	const stats = await Promise.all(
		links.map(async (link) => {
			const start = performance.now();
			try {
				const res = await fetch(link);
				const end = performance.now();
				return {
					statsUrl: link,
					status: res.ok,
					latency: end - start,
					time : new Date(Date.now()).toISOString()
				};
			} catch (error: any) {
				const end = performance.now();
				return {
					statsUrl : link,
					status: "error",
					latency: end - start,
					error: error.message,
					time : Date.now()
				};
			}
		})
	);

	return stats;
};

export const pingingService = async (PORT: number) => {

	try {
		const res = await fetch(`http://localhost:${PORT}/api/monitor`, {
			method: "GET",
		})
		if (!res.ok) {
			throw new Error(`Failed to fetch monitor data: ${res.statusText}`);
		}
		const data = await res.json();
		const links = data.results.map((value: any) => value.url);

		const stats = await pinger(links);
		//console.log(stats)


		await Promise.all(stats.map(async (stat) => {
			//console.log(JSON.stringify(stat))
			const r = await fetch(`http://localhost:${PORT}/api/monitor/stats/`,{
				headers : {
					'Content-Type' : 'application/json',
				},
				method : 'POST',
				body : JSON.stringify(stat)
			})
			const jsonRes = await r.json()
			//console.log(jsonRes)
		}))
		const response = await fetch(`http://localhost:${PORT}/api/monitor/stats`,{
			method : 'GET'
		})
		
		const d = await response.json();
		//console.log(d)
	} catch (error: any) {
		console.error(`Error in pingingService: ${error.message}`);
	}
};
