# osa-vocabulary-doc

Synthesising the Markdown source for use in an auto-generated word doc.

## Usage

This tool allows you to write documents in markdown and track them
in a Git Repo before synthesising a Word Document version. One
of the advantages is the rich metadata substitution mechanism.

The [Pandoc] engine allows single words to be substituted at
run time. This is what happens to make a document:

1. User types `xr/mdpub.sh` from a shell prompt (zsh / bash / wsl)
2. a pre-processing script runs (`src/tool/mdpub-pre-process.sh`)
3. If needed a node script converts source metadata into JSON.
4. pandoc is configured to load metadata & markdown documents (`src/mdpub-CONFIG`)


## Installation

There are 3 system dependencies that should be installed:

1. [node](https://nodejs.org/en/) LTS - Long Term Stable vcersion
2. [Pandoc](https://pandoc.org/) tyhe document processor

If you're running on a Mac or Linux then jump
straight to **tools installation** below. If you're running
Windows, then you'll need to install **WSL** -
**W**indows **S**ubsystem for **L**inux.

### WSL install on Windows

Most simple - [follow these instructions](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/) to install Ubuntu
as an OS for running commands.

This will involve a couple of reboots, but once it's done you'll

## installing the tools

e**X**ternal **R**esource (**xr**) that power the Mr MXF md-publish system.

**md-publish** is a set of tools for Windwows, Mac & Linux for publishing documents
using the [Pandoc] library. Although [Pandoc] by itself is excellent, there are some
limitations when you want to make a technical document in web, .docx and .pdf formats.

This document has some markdown tips and tricks at the end.

Status: **Work In Active refactoring**

### tools installation

clone this repo to make a folder for your documents project e.g. `some/path/osa-vocabulary-doc`.

Now `cd` into your project folder e.g. `cd some/path//osa-vocabulary-doc`
and shallow clone this repo into a subfolder.
I call the folder `xr` (external resources) so that it's at the bottom
of the folder list and nice and short when typing.

```sh
git clone --depth=1 https://github.com/mrmxf/md-publish xr
```

Occasionally update the scripts in the `xr` folder (Linux and Mac only for now) and see if anything is new:

```sh
xr/mdpub.sh --update
xr/mdpub.sh --help
```

## usage

You can now explore the source structures for the documents and you can build them by
starting a shell in your document folder and using the command:

* _Linux:_ `xr/mdpub.sh`
* _Mac:_ `zsh xr/mdpub.sh`
* _Windows:_ `.\xr\mdpub.bat`

## recommended folder structure

The folder structure below works quite well and helps to locate content in long complicated documents.
The numbers in the filenames help force the source documents to appear in the same order in a file
browser as they do in the published document.

```text
├─ my-document-folder         document folder - contains coy of all files
│  ├─ docs/                   default output folder for the documents
│  ├─ src/                    all the sources for doc1
│  │  ├─ metadata/
|  |  |  └─ doc-properties.json      metadata for the document
│  │  ├─ tool/                    folder for pre & post processing
|  |  ├─ 010-scope.md             1st markdown file in your document
|  |  ├─ 020-intro.md             2nd markdown file in your document
|  |  ├─ 030-body.md              3rd markdown file in your document
|  |  ├─ a00-annex.md             an annex
|  |  ├─ mdpub-CONFIG             automation overrides for this file
|  |  └─ xport-document.yml       pandoc defaults file
│  ├─ src-doc2/               all the sources for doc2
│  ├─ src-doc3/               all the sources for doc3
│  ├─ xr/                     the tools from this repo
│  │  ├─ .git/                   git folder (auto-generated) so that you can auto-update the tools
│  │  ├─ boilerplate/            text to be included for different organisations
│  │  ├─ filter/                 Pandoc filters to modify content in an organisation specific way
│  │  ├─ refdoc/                 Pandoc reference docs for `.docx` creation
│  │  ├─ tools/                  All the scripts to make it work
│  │  ├─ template/               Pandoc default templates for different formats
│  │  ├─ template-init/          The sample document project that gets clones with mdpub --init
│  │  ├─ _SETTINGS               environment variables - copy & edit in src folder
│  │  ├─ mdpub.bat               make your documents (Win)
│  │  └─ mdpub.sh                make your documents (Mac & Linux)
|  └─ .gitignore              prevents you from checking the tools into your document repo
```

## Background

This repository contains templates & tools for making technical documentation
with [pandoc]. It is intended for users wishing to make sophisticated
documents for trade associations and standards bodies. It is understood
that many participants will want to use word and Acrobat for document
review but many authors want to use somthing more sophisticated to
create .docx .pdf .html and .epub content from the same sources.

The default templates are synced with the [pandoc-templates] repo. The
boilerplate and tools are custom for the organisations in which I work.

### Build requirements

To build new output documents you will need to install a few bits of open source softwrae:

* [Pandoc] is the core engine for building asll the outputs. It is a command line application. Fire up a terminal (Win/Mac/Linux) and type `pandoc --version` to see if you have it installed.
* One of the following for making PDF output:
  * [Protext] is needed for generating a Latex intermediate for creating PDFs on Windows
  * [Mactex] is needed for making PDFs on a Mac

A better pre-processing envioroment is being worked on to allow better
inclusion of source files and references within [Pandoc].

## Tips & Trick for markdown

### Getting extensions to work

In the [Pandoc] documentation, you will find many extensions that allow
`multiline_tables`, `grid_tables`, `task_lists` amd other parametric ways
to make visually stunning documents. To enable these, update the `to:`
field of your defaulta file.

original:

```yaml
from: markdown
```

extensions modified:

```yaml
from: markdown+multiline_tables+task_lists-blank_before_header
```

* turn _on_: `multiline_tables`
* turn _on_: `task_lists`
* turn **off**: `blank_before_header`

[Mr MXF]:https://mrmxf.com
[Pandoc]:https://pandoc.org
[pandoc-templates]:https://github.com/jgm/pandoc-templates
[protext]:https://www.tug.org/protext/
[mactex]:https://tug.org/mactex/