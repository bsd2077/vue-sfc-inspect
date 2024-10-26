import serveStatic = require("serve-static")
import { version } from 'vue'
import type {AddressInfo} from 'net'
import path = require('path');
import type {Compiler} from 'webpack'
import {parse} from './parse'
import fs = require('fs');
import opener = require('opener');
import * as http from "node:http";
import {parse_vue2_7} from "./parse_vue2_7";


const pluginName = 'VueSfcInspectPlugin'

type vue_version="2.7"|"2"|"3"
interface option {
    port?: number | "auto",
    auto_open_browser?:boolean

}

let server_port: number


let is_init_tip: boolean = false

function arr_unique(arr: string[]) {
    return Array.from(new Set(arr))
}

class VueSfcInspect {
    server: any
    auto_open_browser:boolean
    vue_resource: string[]
    port: number | "auto"
    vue_version:vue_version

    init_vue_version(){
        let v=version.substring(0,3)
        if(v==="2.7"){this.vue_version="2.7"}else {
            this.vue_version=version.substring(0,1)  as vue_version
        }

    }
    init_server(port: number | "auto") {
        this.server = http.createServer()
        if (this.port === "auto" || this.port === void 0) {
            this.server.listen()
        } else {
            this.server.listen(this.port)
        }

        this.server.on('listening', () => {

            server_port = (this.server.address() as AddressInfo).port


        })


    }

    constructor(option: option = {port: "auto",auto_open_browser:true}) {


        this.vue_resource = []
        this.port = option.port || "auto"
        if(option.auto_open_browser===false){
            this.auto_open_browser =false
        }else { this.auto_open_browser = true}
        this.init_vue_version()

        this.init_server(this.port)
    }

    apply(compiler: Compiler) {

        let node_m = /(node_modules){0}\.vue$/i

        compiler.hooks.compilation.tap(pluginName,
            (compilation) => {
                compilation.hooks.buildModule.tap(
                    pluginName,
                    (module: any) => {
                        if (node_m.test(module.resource)) {
                            this.vue_resource.push(module.resource)
                        }

                    }
                );
            });


        compiler.hooks.afterEmit.tap(
            pluginName,
            (compilation) => {
                if (!is_init_tip) {
                    console.log(`Vue-Sfc-Inspect-Plugin is started at http://127.0.0.1:${(this.server.address() as AddressInfo).port}`)
                    if(this.auto_open_browser===true){
                        opener(`http://127.0.0.1:${(this.server.address() as AddressInfo).port}`)

                    }
                    is_init_tip = true
                }
            }
        );
        compiler.hooks.done.tap(pluginName, (stats) => {

            let unique = arr_unique(this.vue_resource)
            let Template_array = []
            let Template



            if( this.vue_version==="3"){
                unique.forEach((path_sfc) => {
                let sfc = fs.readFileSync(path_sfc, "utf-8")
                Template= parse(sfc.toString(), {
                    filename: path_sfc,
                    isProd: true,
                    parse_type: "Template"
                }).Template;
                if (!Template) {
                    return
                }
                Template_array.push(Template)
            })



            }
            if( this.vue_version==="2.7"){

                unique.forEach((path_sfc) => {
                    let sfc = fs.readFileSync(path_sfc, "utf-8")
                    Template= parse_vue2_7({
source:sfc.toString(),
filename: path_sfc,
                    })
                    if (!Template) {
                        return
                    }
                    Template_array.push(Template)
                })

            }
            if( this.vue_version==="2"){


            }





            let Static_folder = path.join(__dirname, '..', 'static')

            let Static = serveStatic(Static_folder,)

            fs.writeFileSync(path.join(Static_folder, 'template_json.json'), JSON.stringify(Template_array),
                {encoding: 'utf8'})
            this.server.removeAllListeners("request")
            this.server.on("request", async (req, res: http.ServerResponse) => {

                Static(req, res, () => {
                })

            })

        });

    }
}

export {VueSfcInspect};

