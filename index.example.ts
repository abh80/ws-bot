
import websocket from './webSocket'
const client = new websocket('UR TOKEN HERE')
client.login()
client.on('ready',()=>{console.log('ready')})
client.on('message',async msg=>{
    if(msg.content === '-test'){
        let opts = {
            content:'this is a test',
            embed: 
                {
                title:'lol',
                color: 0x0000FF
                }
            
        }
      let data = await client.MessageEmbed(msg.channel_id,opts)
      console.log(data)
    }
})
// u can also change the websocket by forking this project x)