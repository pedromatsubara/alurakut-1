import { SiteClient } from "datocms-client";

export default async function (req, res) {
	if (req.method === "POST") {
		const TOKEN = "2d1bbb2ad49ef167a884199d492e62";
		const client = new SiteClient(TOKEN);

		// validate here()

		const comunidadeCriada = await client.items.create({
			itemType: "970540",
			...req.body,
		});

		console.log(comunidadeCriada);

		res.json({ comunidadeCriada: comunidadeCriada });
		return;
	}

	res.status(404).json({ message: "Sem GET ainda" });
}
