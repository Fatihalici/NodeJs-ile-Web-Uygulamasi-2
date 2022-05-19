const express = require('express');
const app = express();

const readxml = require('./xmlfiles/readxml');
const path = require('path')
const userRoute = require('./routes/Routes')
const neo4 = require('./controller/userneo4j')
const neo4j = require('./controller/neo4j')


const http = require('http').Server(app)
const io = require('socket.io')(http)


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname + '/views')))
app.use('/', userRoute)

io.on('connection', (socket) => {
    console.log("baglandi");
    socket.on('senddatas', async function(args) {
        io.emit('senddatastograph', args)
        var authorArr = []
        if (args.filtername != "" && args.filterpubname != "") { // yazar ve yayın doluysa
            var result = await neo4.bringwithallInputs(args.filtername, args.filterpubname)
            var result2 = await neo4.bringauthorswithallInputs(args.filterpubname)

            io.emit('sendbackalldatas', result, result2)

        } else if (args.filteryear != "" && args.filtername == "" && args.filterpubname == "") { // sadece year doluysa
            var result = await neo4.bringwithyearAllPubs(args.filteryear)
            io.emit('sendbackpubswithyear', result)
        } else if (args.filterpubname != "") { // sadece yayın doluysa
            var result = await neo4.bringpubinfoswithPub(args.filterpubname)
            var result2 = await neo4.bringauthorswithallInputs(args.filterpubname)
            var result3 = await neo4.bringrealauthorswithPub(args.filterpubname)
            io.emit('sendbackalldatas', result, result2, result3)
        } else if (args.filtername != "" && args.filteryear == "") { // sadece yazar doluysa
            var result = await neo4.bringpubswithAuthor(args.filtername)
            io.emit('sendbackpubswithauthor', result)
        } else if (args.filtername != "" && args.filteryear != "") { // yazar ve yıl doluysa
            var result = await neo4.bringpubswithAuthorandYear(args.filtername, args.filteryear)
            for (const element of result) {
                var ad = element._fields[0].properties.name
                var result2 = await neo4.bringauthorswithAuthorandYear(ad)
                for (const element of result2) {
                    authorArr.push(element._fields[0].properties.name)
                }
            }

            io.emit('sendbackpubswithauthorandyear', result, authorArr)
        }

    });
    socket.on('sendcoauthorinfos', async function(coauthorname, coauthorpubname, coauthoryear) {
        var authorArr = []
        if (coauthorname != "" && coauthorpubname != "") {
            var result = await neo4.bringwithallInputs(coauthorname, coauthorpubname)
            var result2 = await neo4.bringauthorswithallInputs(coauthorpubname)
            io.emit('sendbackalldatas', result, result2)

        } else if (coauthorpubname != "") { // sadece yayın doluysa
            var result = await neo4.bringpubinfoswithPub(coauthorpubname)
            var result2 = await neo4.bringauthorswithallInputs(coauthorpubname)
            io.emit('sendbackalldatas', result, result2, result3)
        } else if (coauthorname != "" && coauthoryear != "") { // yazar ve yıl doluysa
            var result = await neo4.bringpubswithAuthorandYear(coauthorname, coauthoryear)
                // io.emit('sendbackpubswithauthor', result, result2)
            for (const element of result) {
                var ad = element._fields[0].properties.name
                var result2 = await neo4.bringauthorswithAuthorandYear(ad)
                for (const element of result2) {
                    authorArr.push(element._fields[0].properties.name)
                }
            }

            io.emit('sendbackpubswithauthor', result, authorArr)
        }
    })


})

io.on("connect", () => {
    console.log("baglandi");
})

// readxml.readXMLandCreateNode('fulya.xml')
// readxml.readXMLandCreateNode('yasarbecerikli.xml')
readxml.readXMLandCreateNode('ahmetsayar.xml')


http.listen(3000, function() {
    console.log("Listening on port: 3000");
})