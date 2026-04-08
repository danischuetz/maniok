# Origins

Until recently my go-to solution for documenting software architecture as a freelance software engineer was draw.io diagrams embedded in Google Docs. That worked fine for small projects and at the beginning of larger projects but soon became painful to maintain.

- Drawing diagrams was time consuming, so only half the system was properly documented from the start
- Small changes in the system required a lot of effort updating the documentation
- Diagrams were C4-ish but often incomplete or overloaded

Some online research led me to Structurizr and I was impressed with it's capabilities but taken aback by the setup/hosting effort and the UI, which seemed not representative enough for my customers.

The frustration of not having found something satisfying to my needs in a couple of days researching existing solutions and the discovery of some promising node libraries for diagrams and layout finally led to the start of this project

**But first...**

## An ODI research

A couple of weeks into the first experiments, I spoke to a friend about the project who is an experienced team lead and former startup CTO. He cautiously tamed my optimistic excitement about the solutions I was working on and recommended to found this on more solid data in order to determine if I was actually solving the right problem. He recommended the book "Jobs To Be Done" by Tony Ulwick, which I read right away.

Tony Ulwick's system made a lot of sense and I began to structure the problem at hand - "Documenting Software Architecture" - into various steps and about sixty desired outcomes. I used Google Forms to perform a survey on those desired outcomes. It is hard to find participants without paying people to take the survey but in the end ten enthusiasts were willing to share their experience.

That's not enough for solid data but I saw a pattern which aligned well with my experience:

- People who were using wysiwyg tools like draw.io and generic documents were happy with setup complexity, finding stuff and the quality of diagrams but were finding it hard to maintain their documentation over time
- People already using diagrams-as-code were frustrated about setup complexity and quality of the rendered results

That and the different perspective on the problem space allowed me to see how to solve the problems of both groups through providing the best solution for each phase of the process.

# Use Cases

Let's look at a couple of user types and their needs:

- Editors: Architects, Maintainers
    - Edit documentation alongside code changes
    - Use AI to improve documentation and for inline suggestions
    - Create consistent and meaningful diagrams with the right amount of information
    - Review/Merge documentation changes
    - Maintain future documentation changes, e.g. alongside developing features
    - Preview rendered documentation during editing
    - Share documentation
- Viewers: Team members, new hires, other departments
    - Quick access to the documentation
    - Easily understandable documentation
    - Easily understandable diagrams
    - Easily find information

# Overview

To get the job "Document Software Architecture" done with as little friction as possible, we can leverage existing strengths of git and Structurizr:

- All elementary editor needs can be met by using documentation-as-code in git repositories, allowing editors to use their favorite IDE and tooling to edit the documentation
- By using C4 and the Structurizr DSL, the effort to maintain diagrams is minimized. Structurizr also supports embedding markdown documents associated with elements of the software system
- A documentation frontend based on modern web technologies (XYFlow, dagrejs and unified/remark/rehype) allows us to create good UX and great looking diagrams for viewers and opens up a ton of possibilities for the future

Using the Structurizr DSL has another benefit - on export, the whole documentation is written to a single `workspace.json` file. This allows us to find the documentation for any repository for which we know where that file is.

This also paves the way for private repositories, at least for GitHub: Creating a GitHub App, clients can give the Maniok webapp granular access to the `workspace.json` file, using single file access.

![Maniok System Context View](embed:SystemContextView)
