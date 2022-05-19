const express = require('express');
const router = express.Router();
const path = require('path')
const neo4 = require('../controller/neo4j')

const neo4j = require('neo4j-driver');
const driver = neo4j.driver('DATABASE-IP',
    neo4j.auth.basic('neo4j', 'DATABASE-CODE'), { /* encrypted: 'ENCRYPTION_OFF' */ });


const session = driver.session({ database: "neo4j" })


router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../views/user.html'))
})

router.get('/neo4jscreen', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/neo4jscreen.html'))
})

router.post('/adminlogin', async(req, res) => {
    if (req.body.text == "fatih@hotmail.com" && req.body.password == "a") {
        res.redirect('/admin.html')
    } else {
        res.send('Hatalı email veya şifre girdiniz. Lütfen doğru bilgileri giriniz')
    }
})


router.post('/admin', async(req, res) => {
    console.log("getadminpage");
    var authorname = req.body.authorname
    var publicationname = req.body.publicationname // title
    var year = req.body.year // yıl 
    var placeofpublication = req.body.placeofpublication // yer journal
    var publicationtype = req.body.publicationtype; // tur
    await neo4.createTur2(publicationtype, placeofpublication).then(async results => {
        await neo4.createYayınAdı2(publicationname, year, publicationtype, placeofpublication)
        await neo4.createRelationShip2(publicationname, publicationtype, placeofpublication)
        await neo4.createYazar2(authorname)
        await neo4.createotherRelationshipsofTeacher2(authorname, publicationname)
        await neo4.createRelationshipsofcoAuthors(authorname, publicationname)
        await neo4.createRelationshipbetweenAuthors2(authorname, publicationname)
        await neo4.deleteownRelationship()
        await neo4.deleteduplicateRelationship()
    })
})

module.exports = router;