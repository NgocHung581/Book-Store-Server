import axios from "axios";

const fetchResults = async (id) => {
    const api_key = process.env.BRIGHTDATA_API_KEY;
    const res = await axios.get(
        `https://api.brightdata.com/dca/dataset?id=${id}`,
        { headers: { Authorization: `Bearer ${api_key}` } }
    );

    if (res.data.status === "building" || res.data.status === "collecting") {
        console.log("NOT COMPLETE YET, TRYING AGAIN...");
        return fetchResults(id);
    }

    return res.data;
};

export default fetchResults;
