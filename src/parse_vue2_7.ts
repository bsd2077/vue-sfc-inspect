import type {SFCParseOptions, SFCTemplateCompileResults} from "@vue/compiler-sfc";
import  {compileTemplate, parse} from "@vue/compiler-sfc";


function parse_vue2_7(options:SFCParseOptions){
    let template_string= parse(options).template.content
    let SFCTemplateCompileResults:SFCTemplateCompileResults=compileTemplate({
        isProduction: true,
        source:template_string,
        filename: options.filename,
    })
   return {
        code: SFCTemplateCompileResults.code,
            filename:  options.filename,
            source: SFCTemplateCompileResults.source
    }

}
export {parse_vue2_7}
