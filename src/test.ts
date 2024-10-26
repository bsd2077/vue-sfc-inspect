import {parse_vue2_7} from "./parse_vue2_7";
import * as fs from "node:fs";
import {version} from "vue";
let Template





  let sfc = fs.readFileSync("../test/error404.vue", "utf-8")
Template= parse_vue2_7({
    source:sfc.toString(),
    filename: "../test/error404.vue",
})
