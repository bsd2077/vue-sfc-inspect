let Template_object
let h = Vue.h
let xhr = new XMLHttpRequest()
xhr.open('GET', '/template_json.json', false)
xhr.onload = function () {
    Template_object = JSON.parse(xhr.responseText)

}
xhr.send();
const app = Vue.createApp({
    watch: {
        option(val, oldVal) {
            let array = this.Template
            const found = array.find((element) => {

                return element.filename === this.option

            })

            this.source = found.source
            this.code = found.code
        }
    },
    data() {
        return {
            option: Template_object[0].filename,
            Template: Template_object,
            filename: Template_object[0].filename,
            source: Template_object[0].source,
            code: Template_object[0].code
        }
    },
    render() {
        let ctx = this

        let select_model_vnode = h('select', {
                style: {margin: '10px'},
                onChange(event) {
                    ctx.option = event.target.value
                }
            },
            Array.from(this.Template).map((i) => {
                return h('option', {innerHTML: i.filename})
            })
        )
        let vnode = h('div', [h('div', {style: {display: 'flex'}}, [h('label', {
            style: {"font-size": "20px", display: 'block', margin: "10px"},
            innerHTML: '--Please choose an vue  file--'
        }),
            select_model_vnode]),
            h('div', {style: {"justify-content": "center", display: 'flex'}},
                [h('textarea', {
                    style: {
                        "background-color": "#eda302", "border-radius": "10px", "padding": "10px",
                        "margin": "10px"
                    }, "rows": "35", "cols": "60", "readonly": true, innerHTML: this.source
                }),
                    h('div', {
                            style: {"text-align": "center", margin: 'auto 0 '}
                        }, [h('h1', {style: {"color": "#00beff"}, innerHTML: 'Template'}),
                            h('h1', {innerHTML: '===>'})],
                    ),
                    h('textarea', {
                        style: {
                            "background-color": "#c4dc45", "padding": "10px",
                            "margin": "10px"
                        }, "rows": "35", "cols": "60", "readonly": true, innerHTML: this.code
                    }),
                ]
            )])

        return vnode

    },

}).mount("#inspect")


