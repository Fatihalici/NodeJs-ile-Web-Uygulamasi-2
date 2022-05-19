const xml2js = require('xml2js');
const fs = require('fs');

const parser = new xml2js.Parser({ attrkey: 'ATTR' });
const neo4 = require('../controller/neo4j');
const async = require('async')


const neo4j = require('neo4j-driver');
const driver = neo4j.driver('DATABASE-IP',
    neo4j.auth.basic('neo4j', 'DATABASE-CODE'), { /* encrypted: 'ENCRYPTION_OFF' */ });


const session = driver.session({ database: "neo4j" });


async function readXMLandCreateNode(file) {
    let xml_string = fs.readFileSync(__dirname + "/" + file, "utf8");
    extractedData = ""
    parser.parseString(xml_string, async function(error, result) {
        if (error === null) {
            teacher = result['dblpperson'].ATTR.name;
            extractedData = result['dblpperson']['r']
            for (let index = 0; index < extractedData.length; index++) {
                const element = extractedData[index];
                if ("article" in element) {
                    var authorArr = []
                    var tur = "article"
                    var date = element.article[0].ATTR.mdate;
                    var authors = element.article[0].author;
                    authors.forEach(element => {
                        authorArr.push(element._)
                    });
                    var title = element.article[0].title; // yayınadı
                    var year = element.article[0].year[0] //yayın yılı
                    var journal = element.article[0].journal[0] // yayın yeri

                    await neo4.createTur(tur, journal)
                    await neo4.createYayınAdı(title, year, tur, journal)
                    await neo4.createRelationShip(title, tur, journal)

                    for (const yazar of authorArr) {
                        await neo4.createYazar(yazar)

                        if (teacher != yazar) {
                            await neo4.createRelationshipbetweenAuthors(teacher, yazar)
                            await neo4.createotherRelationshipsofTeacher(teacher, title)
                            await neo4.createRelationshipsofcoAuthors(yazar, title)

                        }

                    }

                } else {
                    var authorArr = []
                    var tur = "inproceedings"
                    var date = element.inproceedings[0].ATTR.mdate;
                    var authors = element.inproceedings[0].author;
                    authors.forEach(element => {
                        authorArr.push(element._)
                    });

                    var title = element.inproceedings[0].title;
                    var year = element.inproceedings[0].year[0]
                    var journal = element.inproceedings[0].booktitle[0]
                    await neo4.createTur(tur, journal)
                    await neo4.createYayınAdı(title, year, tur, journal)
                    await neo4.createRelationShip(title, tur, journal)


                    for (const yazar of authorArr) {
                        await neo4.createYazar(yazar)

                        if (teacher != yazar) {
                            await neo4.createRelationshipbetweenAuthors(teacher, yazar)
                            await neo4.createotherRelationshipsofTeacher(teacher, title)
                            await neo4.createRelationshipsofcoAuthors(yazar, title)
                        }

                    }

                }

            }

        } else {
            console.log(error);
        }
    });

    session.close()
}


exports.readXMLandCreateNode = readXMLandCreateNode