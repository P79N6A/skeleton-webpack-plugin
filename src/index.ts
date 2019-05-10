import Server from './server'
import Schema from './schema'
import Util from './util'
const PLUGIN_NAME = 'skeleton-webpack-plugin'
const STATIC_PATH = '__webpack_page_skeleton__'
const DEFAULT_PORT = 9797
const EXCEPTION_EVENTS = ['watch-close', 'failed']
const DEFAULT_COLOR = '#efefef'

class SkeletonPlugin {
    options: Schema
    server: any
    constructor(options: Schema) {
        this.options = options
    }
    createServer() {
        this.server = new Server(Object.assign({}, { color: DEFAULT_COLOR }, this.options))
        this.server.listen().catch((err: any) => this.server.log.warn(err))
    }
    addScriptForClient(htmlData: any) {
        const port = this.options.port || DEFAULT_PORT
        if (process.env.NODE_ENV !== 'production') {
            const client = `http://localhost:${port}/${STATIC_PATH}/index.bundle.js`
            htmlData.html = Util.addScriptTag(htmlData.html, client, port)
        }
    }
    deleteInsertedScript(htmlData: any) {
        let currentHtml = htmlData.html
        return currentHtml.replace(/<script label="insertscript">([^<]*)<\/script>/g, '')
    }
    generateSkeleton() {
        try {
            await Util.generateSkeleton()
        } catch (err) {
            this.server.log.warn(err.toString())
        }
    }
    async apply(compiler: any) {
        if (compiler.hooks) {
            compiler.hooks.entryOption.tap(PLUGIN_NAME, () => {
                this.createServer()
            })

            compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
                    PLUGIN_NAME,
                    (htmlData: any, callback: any) => {
                        this.addScriptForClient(htmlData)
                        callback(null, htmlData)
                    }
                )
            })

            compiler.hooks.afterEmit.tap(PLUGIN_NAME, async () => {
                await this.generateSkeleton()
            })
            EXCEPTION_EVENTS.forEach(event => {
                compiler.hooks[Util.snakeToCamel(event)].tap(PLUGIN_NAME, () => {
                    if (this.server) {
                        this.server.close()
                    }
                })
            })
        } else {
            compiler.plugin('entry-option', () => {
                this.createServer()
            })

            compiler.plugin('compilation', (compilation: any) => {

                compilation.plugin('html-webpack-plugin-before-html-processing', (htmlData: any, callback: any) => {
                    console.log('html-webpack-plugin-before-html-processing')
                    this.addScriptForClient(htmlData)
                    callback(null, htmlData)
                })
            })

            compiler.plugin('after-emit', async (compilation: any, done: any) => {
                await this.generateSkeleton()
                done()
            })
            EXCEPTION_EVENTS.forEach(event => {
                compiler.plugin(event, () => {
                    if (this.server) {
                        this.server.close()
                    }
                })
            })
        }
    }
}