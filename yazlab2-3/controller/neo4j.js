const neo4j = require('neo4j-driver');
const driver = neo4j.driver('DATABASE-IP',
    neo4j.auth.basic('neo4j', 'DATABASE-CODE'), { /* encrypted: 'ENCRYPTION_OFF' */ });


const session = driver.session({ database: "neo4j" });

async function createTur(tur, journal) {
    const result = await session.run(`
    MERGE (tur:Tür {name: '${tur}', yer: '${journal}'})
    RETURN tur`)

}

async function createYayınAdı(title, year, tur, journal) {
    const result = await session.run(`
    MERGE (yayınadı:YayınAdı {name: '${title}', yıl: '${year}', turu: '${tur}', yayınyeri: '${journal}'})
    RETURN yayınadı`)

}

async function createRelationShip(title, tur, journal) {
    const result = await session.run(`MATCH (yayınadı:YayınAdı {name:'${title}'}),(tur:Tür {name: '${tur}', yer: '${journal}'})
    MERGE(yayınadı)-[b:YayınınTürü]->(tur)
    RETURN yayınadı,tur,b`)

}

async function createYazar(teacher) {
    const result = await session.run(`
    MERGE (yazar:YazarAdı {name: '${teacher}'})
    RETURN yazar`)

}


async function createRelationshipbetweenAuthors(teacher, yazar) {
    const result = await session.run(`MATCH (yazar:YazarAdı {name:'${teacher}'}), (yardımcıyazar:YazarAdı {name: '${yazar}'})
    MERGE (yazar)-[c:OrtakCalısır]->(yardımcıyazar)
    RETURN yazar,yardımcıyazar,c`)

}

async function createotherRelationshipsofTeacher(teacher, title) {
    const result = await session.run(`MATCH (yazar:YazarAdı {name:'${teacher}'}), (yayınadı:YayınAdı {name: '${title}'})
    MERGE (yazar)-[d:YayınYazarıdır]->(yayınadı)
    RETURN yazar,yayınadı,d`)

}


async function createRelationshipsofcoAuthors(yazar, title) {
    const result = await session.run(`MATCH (yardımcıyazar:YazarAdı {name:'${yazar}'}), (yayınadı:YayınAdı {name: '${title}'})
    MERGE (yardımcıyazar)-[f:YayınYazarıdır]->(yayınadı)
    RETURN yardımcıyazar,yayınadı,f`)

}



async function createLoginNode() {
    const result = await session.run(`MERGE (login:Admin {name: 'Admin', email: 'fatih@hotmail.com', password: 'a'})
    RETURN login.email
    ,login.password`)
    return result.records
}

async function createLogin() {
    var result = await createLoginNode()
    return result.records
}




// Admin Sayfası Kullanıcı Ekleme Fonksiyonları



async function createTur2(tur, journal) {
    const results = await session.run(`
MERGE (tur:Tür {name: '${tur}', yer: '${journal}'})
RETURN tur`)

}

async function createYayınAdı2(title, year, tur, journal) {
    const result = await session.run(`
    MERGE (yayınadı:YayınAdı {name: '${title}', yıl: '${year}', turu: '${tur}', yayınyeri: '${journal}'})
    RETURN yayınadı`)
}

async function createRelationShip2(title, tur, journal) {
    const result = await session.run(`MATCH (yayınadı:YayınAdı {name:'${title}'}),(tur:Tür {name: '${tur}', yer: '${journal}'})
    MERGE(yayınadı)-[b:YayınınTürü]->(tur)
    RETURN yayınadı,tur,b`)
}

async function createYazar2(teacher) {
    const result = await session.run(`
    MERGE (yazar:YazarAdı {name: '${teacher}'})
    RETURN yazar`)
}

async function createRelationshipbetweenAuthors2(teacher, title) {
    const result = await session.run(`MATCH (yazar:YazarAdı)-[:YayınYazarıdır]->(yayınadı:YayınAdı{name:'${title}'}), (yardımcıyazar:YazarAdı {name: '${teacher}'})
    MERGE (yazar)-[c:OrtakCalısır]->(yardımcıyazar)
    RETURN yazar,yardımcıyazar,c`)
}

async function createRelationshipsofcoAuthors2(yazar, title) {
    const result = await session.run(`MATCH (yardımcıyazar:YazarAdı {name:'${yazar}'}), (yayınadı:YayınAdı {name: '${title}'})
    MERGE (yardımcıyazar)-[f:YayınYazarıdır]->(yayınadı)
    RETURN yardımcıyazar,yayınadı,f`)
}

async function createotherRelationshipsofTeacher2(teacher, title) {
    const result = await session.run(`MATCH (yazar:YazarAdı {name:'${teacher}'}), (yayınadı:YayınAdı {name: '${title}'})
    MERGE (yazar)-[d:YayınYazarıdır]->(yayınadı)
    RETURN yazar,yayınadı,d`)
}

async function deleteownRelationship() {
    const result = await session.run(`MATCH (yazar:YazarAdı)-[c:OrtakCalısır]->(yazar) 
    DELETE c;`)
}
async function deleteduplicateRelationship() {
    const result = await session.run(`MATCH (s)-[r:
        OrtakCalısır ]-(n)
    with s,n,type(r) as t, collect(r) as coll 
    foreach(x in tail(coll) | delete x)`)
}



exports.createTur = createTur
exports.createYayınAdı = createYayınAdı
exports.createRelationShip = createRelationShip
exports.createRelationShip2 = createRelationShip2
exports.createYazar = createYazar
exports.createRelationshipbetweenAuthors = createRelationshipbetweenAuthors
exports.createotherRelationshipsofTeacher = createotherRelationshipsofTeacher
exports.createRelationshipsofcoAuthors = createRelationshipsofcoAuthors
exports.createLogin = createLogin
exports.createLoginNode = createLoginNode
exports.deleteduplicateRelationship = deleteduplicateRelationship
exports.deleteownRelationship = deleteownRelationship
exports.createotherRelationshipsofTeacher2 = createotherRelationshipsofTeacher2
exports.createRelationshipsofcoAuthors2 = createRelationshipsofcoAuthors2
exports.createRelationshipbetweenAuthors2 = createRelationshipbetweenAuthors2
exports.createYazar2 = createYazar2
exports.createYayınAdı2 = createYayınAdı2
exports.createTur2 = createTur2