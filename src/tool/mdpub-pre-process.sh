# PRE-process shell script for this document
# all file paths are relative to the root folder of the project
#
# DOC_PREFIX and DOC_DATE are provided to make filenames like:
# <destination-path>/${DOC_PREFIX}-title-${DOC_DATE}(description).ext
#
# e.g. docs/34CS-WD-ST-2125-1a-json-schema-2020-12-25(draft-element-a).json
#
SCRIPTPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
#
# different convertor needed
#node  $SCRIPTPATH/submission-xml-to-json.js