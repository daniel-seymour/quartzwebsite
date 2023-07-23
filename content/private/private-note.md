---
title: "Private Stuff"
---
TODO:
- Get rid of night/day button
- Have personal photo?
- Move links to main page or get rid. 
- Have ToC and less notes
- Upload CV
- Link to Twitter at bottom or no. Probably yes
- Join discord for Quartz
- Set up Natural Language search
- How to automatically create note inside folder

Natural language search is powered by [Operand](https://beta.operand.ai/). It understands language like a person does and finds results that best match user intent. In this sense, it is closer to how Google Search works.

  

Natural language search tends to produce higher quality results than full-text search.

  

Here's how to set it up.


1. Login or Register for a new Operand account. Click the verification link sent to your email, and you'll be redirected to the dashboard. (Note) You do not need to enter a credit card to create an account, or get started with the Operand API. The first $10 of usage each month is free. To learn more, see pricing. If you go over your free quota, we'll (politely) reach out and ask you to configure billing.

2. Create your first index. On the dashboard, under "Indexes", enter the name and description of your index, and click "Create Index". Note down the ID of the index (obtained by clicking on the index name in the list of indexes), as you'll need it in the next step. IDs are unique to each index, and look something like `uqv1duxxbdxu`.

3. Click into the index you've created. Under "Index Something", select "SITEMAP" from the dropdown and click "Add Source".

4. For the "Sitemap.xml URL", put your deployed site's base URL followed by `sitemap.xml`. For example, for `quartz.jzhao.xyz`, put `https://quartz.jzhao.xyz/sitemap.xml`. Leave the URL Regex empty.

5. Get your API key. On the dashboard, under "API Keys", you can manage your API keys. If you don't already have an API key, click "Create API Key". You'll need this for the next step.

6. Open `data/config.yaml`. Set `enableSemanticSearch` to `true`, `operandApiKey` to your copied key, and `operandIndexId` to the ID of the index we created from earlier..

- Check these

- [Quartz Documentation (this site!)](https://quartz.jzhao.xyz/)

- [Jacky Zhao's Garden](https://jzhao.xyz/)

- [Scaling Synthesis - A hypertext research notebook](https://scalingsynthesis.com/)

- [AWAGMI Intern Notes](https://notes.awagmi.xyz/)

- [Shihyu's PKM](https://shihyuho.github.io/pkm/)

- [SlRvb's Site](https://slrvb.github.io/Site/)

- [Course notes for Information Technology Advanced Theory](https://a2itnotes.github.io/quartz/)

- [Brandon Boswell's Garden](https://brandonkboswell.com)

- [Siyang's Courtyard](https://siyangsun.github.io/courtyard/)

- [Data Dictionary 🧠](https://glossary.airbyte.com/)

- [sspaeti.com's Second Brain](https://brain.sspaeti.com/)

- [oldwinterの数字花园](https://garden.oldwinter.top/)

- [SethMB Work](https://sethmb.xyz/)

- [Abhijeet's Math Wiki](https://abhmul.github.io/quartz/Math-Wiki/)

- [Mike's AI Garden 🤖🪴](https://mwalton.me/)

  

