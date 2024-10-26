interface options {
    filename: string
    isProd?: boolean
    parse_type: string
}

let {compileStyle, compileTemplate, parse: parse_1, compileScript} = require("vue/compiler-sfc")


import type {
    SFCParseResult,
    TemplateCompiler,
    CompilerOptions,
    SFCTemplateCompileResults,
    SFCBlock,
    SFCTemplateCompileOptions,
    SFCScriptCompileOptions,
} from 'vue/compiler-sfc'


function parse(sfc: string, options: options) {
    type descriptor = SFCParseResult["descriptor"]
    type errors = SFCParseResult["errors"]

    let {
        descriptor,
        errors
    }: {
        descriptor: descriptor
        errors: errors
    } = parse_1(sfc)

    if (!descriptor.template) {
        return {
            Template: void 0,

            filename: options.filename,
        }
    }

    let comTemplate: SFCTemplateCompileResults = compileTemplate({
        source: descriptor.template?.content,
        filename: options.filename,
        id: options.filename
    })

    let codeTemplate = comTemplate.code
    if (options.parse_type === "Template") {
        return {
            Template: {
                code: codeTemplate,
                filename: options.filename,
                source: descriptor.template?.content
            },

            filename: options.filename,
        }
    }

}

export {parse};
