import axios from "axios";

import fetchResults from "../../utils/fetchResults.js";
import Search from "../models/Search.js";

class AmazonSearchController {
    // [POST] /amazon/search
    async onScraperComplete(req, res) {
        const { success, id } = req.body;

        if (!success) {
            await Search.findOneAndUpdate(
                { id },
                { status: "error" },
                { returnDocument: "after" }
            );
        }

        const data = await fetchResults(id);

        await Search.findOneAndUpdate(
            { id },
            { status: "complete", results: data },
            { returnDocument: "after" }
        );

        res.json({ message: "Scraping Function Finished" });
    }

    // [POST] /amazon/search
    async search(req, res) {
        try {
            const { search } = req.body;

            const response = await axios.post(
                "https://api.brightdata.com/dca/trigger?collector=c_lgucofbs225btl7nmx&queue_next=1",
                { search },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
                    },
                }
            );
            const { collection_id, start_eta } = response.data;
            const newSearch = new Search({
                id: collection_id,
                search,
                start_eta,
                status: "pending",
            });
            await newSearch.save();
            return res.status(200).json({ collection_id, start_eta });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new AmazonSearchController();
