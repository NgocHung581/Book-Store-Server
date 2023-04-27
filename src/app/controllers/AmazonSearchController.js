import axios from "axios";

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase.js";
import fetchResults from "../../utils/fetchResults.js";
import Search from "../models/Search.js";

class AmazonSearchController {
    // [POST] /amazon/search
    async onScraperComplete(req, res) {
        const { success, id, finished } = req.body;

        if (!success) {
            await updateDoc(doc(db, "searches", id), {
                status: "error",
                updatedAt: finished,
            });
        }

        const data = await fetchResults(id);

        await updateDoc(doc(db, "searches", id), {
            status: "complete",
            results: data,
            updatedAt: finished,
        });

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

            await setDoc(doc(db, "searches", collection_id), {
                search,
                start_eta,
                status: "pending",
            });

            return res.status(200).json({ collection_id, start_eta });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // [GET] /amazon/search/results/:id
    async getResults(req, res) {
        try {
            const { id } = req.params;
            const results = await Search.findOne({ id });

            return res.status(200).json({ data: results });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new AmazonSearchController();
