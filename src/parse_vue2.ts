interface options {
    filename: string
    isProd?: boolean
    parse_type?: string
}
import type {SFCParseOptions, SFCTemplateCompileResults} from "@vue/compiler-sfc";
import  {compileTemplate, parse} from "@vue/compiler-sfc";


function parse_vue2(source: string, options?: options){
    let template_string= parse(source).descriptor.template.content
    let SFCTemplateCompileResults:SFCTemplateCompileResults=compileTemplate({
        id: options.filename,
        isProd: true,
        source:template_string,
        filename: options.filename,
    })
    return {
        code: SFCTemplateCompileResults.code,
        filename:  options.filename,
        source: SFCTemplateCompileResults.source
    }

}
export {parse_vue2}

