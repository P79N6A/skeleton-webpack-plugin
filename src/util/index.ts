import Schema from '../schema'
import * as path from 'path'
import * as fs from 'fs'

export default {
    addScriptTag(source: string, client: string, port: number) {
        const token = source.split('</body>')
        if (token.length < 2) return source
        const scriptTag = `
          <script label="insertscript">
            window._skeletonSocketPort = ${port}
          </script>
          <script label="insertscript" type="text/javascript" src="${client}" defer></script>
        `
        return `${token[0]}${scriptTag}</body>${token[1]}`
    },
    async generateSkeleton(skeletonHtml: string, pageName: string, options: Schema, log: (str: string) => void) {
        const outDir = options.outDir
        const outputPath = path.join(outDir, `${pageName}.skeleton.html`)
        await fs.writeFile(outputPath, skeletonHtml, { encoding: 'utf-8' }, () => { })
        log(`write ${outputPath} successfully in ${outDir}`)
        return Promise.resolve()
    },
    snakeToCamel(name: string) {
        return name.replace(/-([a-z])/g, (_, p1) => p1.toUpperCase())
    }
}