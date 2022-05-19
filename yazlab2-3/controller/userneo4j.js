const neo4j = require('neo4j-driver');
const driver = neo4j.driver('DATABASE-IP',
    neo4j.auth.basic('neo4j', 'DATABASE-CODE'), { /* encrypted: 'ENCRYPTION_OFF' */ });

const session = driver.session({ database: "neo4j" });



async function bringwithallInputs(yazar, title) {
    const result = await session.run(`MATCH (yazar:YazarAdı {name: '${yazar}'})-[:YayınYazarıdır]->(yayınadı:YayınAdı{name: '${title}'}) 
    RETURN yayınadı.name,yayınadı.yayınyeri,yayınadı.turu,yayınadı.yıl, yazar.name`)

    return result.records[0]._fields
}
async function bringauthorswithallInputs(title) {
    const result = await session.run(`MATCH (yardımcıyazar:YazarAdı)-[:YayınYazarıdır]->(:YayınAdı{name: '${title}'})
    RETURN *`)
    return result.records
}
async function bringpubinfoswithPub(title) {
    const result = await session.run(`MATCH (yayınadı:YayınAdı{name: '${title}'}) 
    RETURN yayınadı.name,yayınadı.yayınyeri,yayınadı.turu,yayınadı.yıl`)
    return result.records[0]._fields
}
async function bringrealauthorswithPub(title) {
    const result = await session.run(`MATCH (yazar:YazarAdı {name: 'Yasar Becerikli'})-[:YayınYazarıdır]->(:YayınAdı{name: '${title}'}) 
    RETURN distinct yazar.name`)
    return result.records[0]._fields[0]
}

async function bringwithyearAllPubs(year) {
    const result = await session.run(`
            MATCH(n: YayınAdı { yıl: '${year}' }) RETURN * `)
    return result.records
}

async function bringpubswithAuthor(yazar) {
    const result = await session.run(`MATCH (:YazarAdı {name: '${yazar}'})-[:YayınYazarıdır]->(yayınadı:YayınAdı)
    RETURN *`)
    return result.records
}
async function bringpubswithAuthorandYear(yazar, year) {
    const result = await session.run(`MATCH (:YazarAdı {name: '${yazar}'})-[:YayınYazarıdır]->(yayınadı:YayınAdı {yıl: '${year}'})
    RETURN *`)
    return result.records
}


async function bringauthorswithAuthorandYear(pub) {
    const result = await session.run(`MATCH 
    (yazar:YazarAdı)-[:YayınYazarıdır]->(:YayınAdı {name: '${pub}'})
    RETURN distinct yazar`)
    return result.records
}
// Performance Evaluation of Support Vector Machine and Convolutional Neural Network Algorithms in Real-Time Vehicle Type Classification.

exports.bringwithallInputs = bringwithallInputs;
exports.bringwithyearAllPubs = bringwithyearAllPubs
exports.bringauthorswithallInputs = bringauthorswithallInputs
exports.bringpubinfoswithPub = bringpubinfoswithPub
exports.bringrealauthorswithPub = bringrealauthorswithPub
exports.bringpubswithAuthor = bringpubswithAuthor
exports.bringpubswithAuthorandYear = bringpubswithAuthorandYear
exports.bringauthorswithAuthorandYear = bringauthorswithAuthorandYear