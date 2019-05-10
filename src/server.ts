import * as Events from 'events'
import Schema from './schema'
class Server extends Events {
    options: Schema
    constructor(options: Schema) {
        super()
        this.options = options
    }
}

export default Server