import axios from "axios";
import conf from "../config.json";

const ax = axios.create({
  baseURL: `${conf.requestURL}/api/`,
});

export default ax;