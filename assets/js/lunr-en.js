var idx = lunr(function () {
  this.field('title', {boost: 10})
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')
});



  
  
    idx.add({
      title: "How I created my blog",
      excerpt: "For quite some months, I’ve been planning to create a website and start blogging about the things I’m passionate about....",
      categories: ["blog"],
      tags: ["howto"],
      id: 0
    });
    
  
    idx.add({
      title: "A private Maven repository for Android in 30 min",
      excerpt: "Setting up your own Maven repository and uploading artifacts to it is quite a daunting task. As I went through...",
      categories: ["blog"],
      tags: ["android","tools","maven","artifactory"],
      id: 1
    });
    
  
    idx.add({
      title: "Getting the most out of Artifactory",
      excerpt: "My previous blog post described how to set up your own private Maven repository with Artifactory in 30 minutes. This...",
      categories: ["blog"],
      tags: ["android","tools","maven","artifactory"],
      id: 2
    });
    
  
    idx.add({
      title: "Level up GitHub builds with CI and code coverage",
      excerpt: "Wouldn’t you love to have your open source projects built automatically by a continuous integration server? And to have a...",
      categories: ["blog"],
      tags: ["android","tools","coverage","ci"],
      id: 3
    });
    
  
    idx.add({
      title: "Year in review 2015",
      excerpt: "Finally found the time to write my year in review. #insomnia 2015 was a huge year for me! I even...",
      categories: ["blog"],
      tags: ["review"],
      id: 4
    });
    
  
    idx.add({
      title: "Git as a secure private Maven repository",
      excerpt: "As my previous blogposts already covered how to set up a private Maven repository, you might wonder “Why again a...",
      categories: ["blog"],
      tags: ["android","maven","bitbucket"],
      id: 5
    });
    
  
    idx.add({
      title: "A successful XML naming convention",
      excerpt: "Do you remember the last time you had to dig into strings.xml to find the right String to use? Or...",
      categories: ["blog"],
      tags: ["android","resources","cleancode"],
      id: 6
    });
    
  
    idx.add({
      title: "Droidcon Italy recap",
      excerpt: "A conference about our favorite Green little robots? In sunny Italy? With great food and a party? Yeah, I can...",
      categories: ["blog"],
      tags: ["android","conference","droidcon"],
      id: 7
    });
    
  
    idx.add({
      title: "Efficiently reducing your method count",
      excerpt: "As green field projects are a rare breed, chances are that you’ve inherited a legacy code base. If you’re as...",
      categories: ["blog"],
      tags: ["android","tools","proguard","methodcount"],
      id: 8
    });
    
  
    idx.add({
      title: "Droidcon Berlin recap",
      excerpt: "Having founded the entire Droidcon franchise in 2009, Droidcon Berlin is a magical conference to be at. Not only do...",
      categories: ["blog"],
      tags: ["android","conference","droidcon"],
      id: 9
    });
    
  
    idx.add({
      title: "Testing made sweet with a Mockito",
      excerpt: "At Droidcon Berlin 2016 I had a great time talking about testing using the Mockito framework. While the talk wasn’t...",
      categories: ["blog"],
      tags: ["android","mockito","testing","droidcon"],
      id: 10
    });
    
  
    idx.add({
      title: "Turn Android into an awesome cycling GPS",
      excerpt: "Cycling is all about exploring: visiting new places and making existing routes more fun with better streets. So there must...",
      categories: ["blog"],
      tags: ["cycling","howto"],
      id: 11
    });
    
  
    idx.add({
      title: "Why you should care about copyright",
      excerpt: "As die hard Android developers, copyright notices are usually not on top of our priority list. Yet large corporations always...",
      categories: ["blog"],
      tags: ["android","copyright","tools"],
      id: 12
    });
    
  
    idx.add({
      title: "The hidden cost of code coverage",
      excerpt: "Code coverage is an awesome way to motivate you and your team to write more tests. But did you know...",
      categories: ["blog"],
      tags: ["android","tools","gradle","testing"],
      id: 13
    });
    
  
    idx.add({
      title: "Extending Mockito",
      excerpt: "Due to its clean simple api, Mockito has become world’s most popular Java mocking framework. After having covered all of...",
      categories: ["blog"],
      tags: ["android","mockito","testing"],
      id: 14
    });
    
  
    idx.add({
      title: "Year in review 2016",
      excerpt: "It’s that time of the year again to do a little personal retrospective. 2016 passed by so quickly! I had...",
      categories: ["blog"],
      tags: ["review"],
      id: 15
    });
    
  
    idx.add({
      title: "Using Mockito 2.x on Android",
      excerpt: "The Mockito team is on fire lately! Not only did they add support to mock final classes and methods, but...",
      categories: ["blog"],
      tags: ["android","mockito","testing"],
      id: 16
    });
    
  
    idx.add({
      title: "Write awesome unit tests",
      excerpt: "If you can code, you can also write unit tests. Writing awesome tests on the other hand is a different...",
      categories: ["blog"],
      tags: ["android","testing","cleancode"],
      id: 17
    });
    
  
    idx.add({
      title: "Why your app should crash",
      excerpt: "Too many times I’ve seen developers trying to avoid crashes at all cost. But are unhandled exceptions really that bad?...",
      categories: ["blog"],
      tags: ["android","crashes","architecture","cleancode"],
      id: 18
    });
    
  
    idx.add({
      title: "Android Makers FR recap",
      excerpt: "After organizing Droidcon Paris for several year, the organizers decided to move on and experiment with a new format. This...",
      categories: ["blog"],
      tags: ["android","conference","androidmakers"],
      id: 19
    });
    
  
    idx.add({
      title: "My Google #io17 takeaways",
      excerpt: "Being my 2nd year at Google IO, I decided to do things differently: Besides taking notes during sessions, I also...",
      categories: ["blog"],
      tags: ["android","conference","googleio"],
      id: 20
    });
    
  
    idx.add({
      title: "Implementation vs API dependency",
      excerpt: "Upgrading to Android studio 3.0 territory will make building multi-module projects a lot faster, but it also means a breaking...",
      categories: ["blog"],
      tags: ["android","tools","gradle"],
      id: 21
    });
    
  
    idx.add({
      title: "Embracing Java 8 language features",
      excerpt: "For years Android developers have been limited to Java 6 features. While RetroLambda or the experimental Jack toolchain would help,...",
      categories: ["blog"],
      tags: ["android","tools","java"],
      id: 22
    });
    
  
    idx.add({
      title: "The career opportunity called Kotlin",
      excerpt: "This isn’t another post about the benefits of using Kotlin. Hell, I’m not even going to cover any of its...",
      categories: ["blog"],
      tags: ["android","kotlin","career"],
      id: 23
    });
    
  
    idx.add({
      title: "Droidcon UK slides",
      excerpt: "Had a blast visiting Droidcon UK this year and wanted to do a quick post to link to all of...",
      categories: ["blog"],
      tags: ["android","conference","droidconuk"],
      id: 24
    });
    
  
    idx.add({
      title: "The 100% code coverage problem",
      excerpt: "While you may be tempted to strive for 100% code coverage, that would be a horrible idea. Besides some code...",
      categories: ["blog"],
      tags: ["android","testing","coverage"],
      id: 25
    });
    
  
    idx.add({
      title: "The curious case of haunting fragments",
      excerpt: "Do Fragment transactions and back navigation have no more secrets for you? Well then you should try to solve the...",
      categories: ["blog"],
      tags: ["android","fragment","navigation"],
      id: 26
    });
    
  


console.log( jQuery.type(idx) );

var store = [
  
    
    
    
      
      {
        "title": "How I created my blog",
        "url": "https://jeroenmols.com/blog/2015/04/25/blog-creation/",
        "excerpt": "For quite some months, I’ve been planning to create a website and start blogging about the things I’m passionate about....",
        "teaser":
          
            "https://jeroenmols.com/img/blog/jekyll.png"
          
      },
    
      
      {
        "title": "A private Maven repository for Android in 30 min",
        "url": "https://jeroenmols.com/blog/2015/08/06/artifactory/",
        "excerpt": "Setting up your own Maven repository and uploading artifacts to it is quite a daunting task. As I went through...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/artifactory/artifactory.png"
          
      },
    
      
      {
        "title": "Getting the most out of Artifactory",
        "url": "https://jeroenmols.com/blog/2015/08/13/artifactory2/",
        "excerpt": "My previous blog post described how to set up your own private Maven repository with Artifactory in 30 minutes. This...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/artifactory2/artifactory2.png"
          
      },
    
      
      {
        "title": "Level up GitHub builds with CI and code coverage",
        "url": "https://jeroenmols.com/blog/2015/11/13/traviscoveralls/",
        "excerpt": "Wouldn’t you love to have your open source projects built automatically by a continuous integration server? And to have a...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/traviscoveralls/traviscoveralls.png"
          
      },
    
      
      {
        "title": "Year in review 2015",
        "url": "https://jeroenmols.com/blog/2016/01/29/yearinreview/",
        "excerpt": "Finally found the time to write my year in review. #insomnia 2015 was a huge year for me! I even...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/yearinreview15/yearinreview15.png"
          
      },
    
      
      {
        "title": "Git as a secure private Maven repository",
        "url": "https://jeroenmols.com/blog/2016/02/05/wagongit/",
        "excerpt": "As my previous blogposts already covered how to set up a private Maven repository, you might wonder “Why again a...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/wagongit/wagongit.png"
          
      },
    
      
      {
        "title": "A successful XML naming convention",
        "url": "https://jeroenmols.com/blog/2016/03/07/resourcenaming/",
        "excerpt": "Do you remember the last time you had to dig into strings.xml to find the right String to use? Or...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/resourcenaming/resourcenaming.png"
          
      },
    
      
      {
        "title": "Droidcon Italy recap",
        "url": "https://jeroenmols.com/blog/2016/04/08/droidconit/",
        "excerpt": "A conference about our favorite Green little robots? In sunny Italy? With great food and a party? Yeah, I can...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/droidconit16/droidconit.png"
          
      },
    
      
      {
        "title": "Efficiently reducing your method count",
        "url": "https://jeroenmols.com/blog/2016/05/06/methodcount/",
        "excerpt": "As green field projects are a rare breed, chances are that you’ve inherited a legacy code base. If you’re as...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/methodcount/methodcount.png"
          
      },
    
      
      {
        "title": "Droidcon Berlin recap",
        "url": "https://jeroenmols.com/blog/2016/06/18/droidconde/",
        "excerpt": "Having founded the entire Droidcon franchise in 2009, Droidcon Berlin is a magical conference to be at. Not only do...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/droidconde16/droidconde.png"
          
      },
    
      
      {
        "title": "Testing made sweet with a Mockito",
        "url": "https://jeroenmols.com/blog/2016/06/24/droidcondetalk/",
        "excerpt": "At Droidcon Berlin 2016 I had a great time talking about testing using the Mockito framework. While the talk wasn’t...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/droidconde16talk/droidcondetalk.png"
          
      },
    
      
      {
        "title": "Turn Android into an awesome cycling GPS",
        "url": "https://jeroenmols.com/blog/2016/07/21/cyclinggps/",
        "excerpt": "Cycling is all about exploring: visiting new places and making existing routes more fun with better streets. So there must...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/cyclinggps/cyclinggps.png"
          
      },
    
      
      {
        "title": "Why you should care about copyright",
        "url": "https://jeroenmols.com/blog/2016/08/03/copyright/",
        "excerpt": "As die hard Android developers, copyright notices are usually not on top of our priority list. Yet large corporations always...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/copyright/copyright.png"
          
      },
    
      
      {
        "title": "The hidden cost of code coverage",
        "url": "https://jeroenmols.com/blog/2016/09/01/coveragecost/",
        "excerpt": "Code coverage is an awesome way to motivate you and your team to write more tests. But did you know...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/coveragecost/coveragecost.png"
          
      },
    
      
      {
        "title": "Extending Mockito",
        "url": "https://jeroenmols.com/blog/2016/10/31/mockitomatchers/",
        "excerpt": "Due to its clean simple api, Mockito has become world’s most popular Java mocking framework. After having covered all of...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/mockitomatchers/mockitomatchers.png"
          
      },
    
      
      {
        "title": "Year in review 2016",
        "url": "https://jeroenmols.com/blog/2017/01/09/yearinreview/",
        "excerpt": "It’s that time of the year again to do a little personal retrospective. 2016 passed by so quickly! I had...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/yearinreview16/yearinreview16.png"
          
      },
    
      
      {
        "title": "Using Mockito 2.x on Android",
        "url": "https://jeroenmols.com/blog/2017/01/17/mockitoandroid/",
        "excerpt": "The Mockito team is on fire lately! Not only did they add support to mock final classes and methods, but...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/mockitoandroid/mockitoandroid.png"
          
      },
    
      
      {
        "title": "Write awesome unit tests",
        "url": "https://jeroenmols.com/blog/2017/02/16/unittests/",
        "excerpt": "If you can code, you can also write unit tests. Writing awesome tests on the other hand is a different...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/unittests/unittests.png"
          
      },
    
      
      {
        "title": "Why your app should crash",
        "url": "https://jeroenmols.com/blog/2017/03/08/appcrash/",
        "excerpt": "Too many times I’ve seen developers trying to avoid crashes at all cost. But are unhandled exceptions really that bad?...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/appcrash/appcrash.jpg"
          
      },
    
      
      {
        "title": "Android Makers FR recap",
        "url": "https://jeroenmols.com/blog/2017/04/11/androidmakers17/",
        "excerpt": "After organizing Droidcon Paris for several year, the organizers decided to move on and experiment with a new format. This...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/androidmakers17/androidmakers.jpg"
          
      },
    
      
      {
        "title": "My Google #io17 takeaways",
        "url": "https://jeroenmols.com/blog/2017/05/31/googleio17/",
        "excerpt": "Being my 2nd year at Google IO, I decided to do things differently: Besides taking notes during sessions, I also...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/googleio17/googleio17.png"
          
      },
    
      
      {
        "title": "Implementation vs API dependency",
        "url": "https://jeroenmols.com/blog/2017/06/14/androidstudio3/",
        "excerpt": "Upgrading to Android studio 3.0 territory will make building multi-module projects a lot faster, but it also means a breaking...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/androidstudio3/androidstudio3.png"
          
      },
    
      
      {
        "title": "Embracing Java 8 language features",
        "url": "https://jeroenmols.com/blog/2017/07/21/java8language/",
        "excerpt": "For years Android developers have been limited to Java 6 features. While RetroLambda or the experimental Jack toolchain would help,...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/java8language/java8language.jpg"
          
      },
    
      
      {
        "title": "The career opportunity called Kotlin",
        "url": "https://jeroenmols.com/blog/2017/09/13/kotlinopportunity/",
        "excerpt": "This isn’t another post about the benefits of using Kotlin. Hell, I’m not even going to cover any of its...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/kotlinopportunity/kotlinopportunity.png"
          
      },
    
      
      {
        "title": "Droidcon UK slides",
        "url": "https://jeroenmols.com/blog/2017/10/27/droidconuk/",
        "excerpt": "Had a blast visiting Droidcon UK this year and wanted to do a quick post to link to all of...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/droidconuk17/droidconuk.png"
          
      },
    
      
      {
        "title": "The 100% code coverage problem",
        "url": "https://jeroenmols.com/blog/2017/11/28/coveragproblem/",
        "excerpt": "While you may be tempted to strive for 100% code coverage, that would be a horrible idea. Besides some code...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/coverageproblem/coverageproblem.png"
          
      },
    
      
      {
        "title": "The curious case of haunting fragments",
        "url": "https://jeroenmols.com/blog/2017/12/18/fragmentback/",
        "excerpt": "Do Fragment transactions and back navigation have no more secrets for you? Well then you should try to solve the...",
        "teaser":
          
            "https://jeroenmols.com/img/blog/fragmentback/fragmentback.jpg"
          
      }
    
  ]

$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    var query = $(this).val();
    var result = idx.search(query);
    resultdiv.empty();
    resultdiv.prepend('<p class="results__found">'+result.length+' Result(s) found</p>');
    for (var item in result) {
      var ref = result[item].ref;
      if(store[ref].teaser){
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<div class="archive__item-teaser">'+
                '<img src="'+store[ref].teaser+'" alt="">'+
              '</div>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt+'</p>'+
            '</article>'+
          '</div>';
      }
      else{
    	  var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt+'</p>'+
            '</article>'+
          '</div>';
      }
      resultdiv.append(searchitem);
    }
  });
});
