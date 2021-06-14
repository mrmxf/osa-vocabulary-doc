/** @module submission-xml-to-json
 *
 * find some submissions, convert to json and put in metadata folder
 *
 * Algorithm needs tweaking:
 * 1. Create empty JSON metadata register MR with a Register Submission (RS) child
 *    * MR = {Groups:{}, Types:{} ..., RS:{Groups:{} ... , message:{error:[], ..}}}
 * 2. read in all discrete registers from snapshot
 *    * add and read messages to MR.message
 * 3. read in all submission entries. For each entry
 *    a. create an MR.RS.REGISTER object indexed by Symbol
 *    b. add in read / parsing messages to MR.message
 *    c. for any entry with a type
 *        * add MR.RS.REGISTER.TypeSymbol = fn(loookup Type UL & return Type Symbol)
 *        * add MR.RS.REGISTER.TypeSize = fn(loookup Type UL & return Type Size text)
 *    d. for each entry in a group
 *        * copy entry JSON to MR.RS.Groups.ENTRY._Contents.SYMBOL to allow
 *          mustache iteration of the group elements
 *
 * 5. QA
 *   a. check for collisions & log errors to MR.RS.message
 *   b. inspect RS.Groups for IsOptional & update definition with [Req] or [Opt], log errors
 *   c. log unresolved types
 *   g. log unresolved groups
 * 6. export MR.RS as register-submission.json
 * 7. export MR.RS.messages as register-submission-messages.json
 */

const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

const filename_prefix = "src/metadata/meta-"
const tempname_prefix = "src/metadata/tmp-"

const source_paths = [
    "src/register/30MR-REG-DD-ST2117-10-elements.xml",
    "src/register/30MR-REG-DD-ST2117-10-essence.xml",
    "src/register/30MR-REG-DD-ST2117-10-groups.xml",
    "src/register/30MR-REG-DD-ST2117-10-labels.xml",
    "src/register/30MR-REG-DD-ST2117-10-types.xml",
]
const types_paths = [
    "src/register/30MR-REG-DD-ST2117-10-types.xml",
    "src/metadata/Types-snapshot.xml",
]
const groups_paths = [
    "src/register/30MR-REG-DD-ST2117-10-groups.xml",
    "src/metadata/Groups-snapshot.xml",
]

/** refactor the entry XML to a JSON that's suitable for substitution
 *
 * The incoming JSON creates an array of anonimous Entry objects
 * The outer most object is xxxxRegister and  is handled in a for loop
 * {
 *    "ElementsRegister": {
 *      "$": {
 *        "xmlns": "http://www.smpte-ra.org/schemas/335/2012"
 *      },
 *      "Entries": [
 *        {
 *          "Entry": [
 *            { ... an actual entry ... }
 *
 * Outgoing json uses the Entry Symbol as a key
 * and assumes that lower level groups and types hierarchy
 * does not need to be accessed
 * {
 *   Symbol:{
 *       UL: ul,
 *       Kind:.... etc
 *   }
 * }
 */
function refactor_submission(submission, types) {
    let document_substitution = {}
    for (register in submission) {
        //iterate trhough each entry adding an object to document_substitution
        submission[register].Entries[0].Entry.forEach(entry => {
            let tmp = {}
            //iterate through properties using secret knowledge that there are no
            //complex children - only strings or booleans or integers
            for (property in entry) {
                tmp[property] = entry[property][0]
            }
            //add in a type as a string for the document
            if (entry["Type"] && types[entry["Type"][0]]) {
                tmp["TypeSymbol"] = types[entry["Type"][0]].Symbol
                tmp["TypeSize"] = types[entry["Type"][0]].TypeSize
            }
            //add the property to the json array
            document_substitution[entry.Symbol[0]] = tmp
        })
    }
    return document_substitution
}

function refactor_types(register_types) {
    let map = {}
    register_types.TypesRegister.Entries[0].Entry.forEach(type => {
        map[type.UL[0]] = {
            "Symbol": type.Symbol[0],
            "TypeSize": (type.TypeSize) ? type.TypeSize[0] : 0
        }
    })
    return map
}

// do that parsing and file writing in parallel for speed
async function xml_to_json_file(xml, types, destination_path) {
    const parser = new xml2js.Parser()
    parser.parseStringPromise(xml)
        .then(result => {
            let document_metadata = refactor_submission(result, types)
            let document_json = JSON.stringify(document_metadata, undefined, 2)
            fs.writeFileSync(destination_path, document_json)
        })
        .catch(e => {
            console.log(e.message)
        })
}

// first read in the Types
let types = {}
types_paths.forEach(async types_path => {
    let filepath = path.resolve(types_path)
    let basename = path.basename(filepath)
    let xml = fs.readFileSync(filepath)

    const parser = new xml2js.Parser()
    await parser.parseStringPromise(xml)
        .then(result => {
            types = refactor_types(result)
            let destination_path = `${tempname_prefix}types-map.json`
            fs.writeFileSync(destination_path, JSON.stringify(types, undefined, 2))
        })
        .then(result => {
            //take all the source files and JSONify them
            source_paths.forEach(source_path => {
                let filepath = path.resolve(source_path)
                let basename = path.basename(filepath)
                let xml = fs.readFileSync(filepath)
                let destination_path = `${filename_prefix}${basename}.json`

                xml_to_json_file(xml, types, destination_path)
            })
        })
        .catch(e => {
            console.log(e.message)
        })

})
