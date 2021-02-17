---
layout: single
title: "Posts by Tag"
permalink: /tags/
author_profile: true
comments: false
exclude_from_search: true
---

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tags_list = site_tags | split:',' | sort %}

<!-- Start tag array header -->
<div class="page__meta">
  <p class="page__taxonomy">
    <strong><i class="fa fa-fw fa-tags" aria-hidden="true"></i> {{ site.data.ui-text[site.locale].tags_label | default: "Tags:" }} </strong>
    <span itemprop="keywords">
      {% for item in (0..site.tags.size) %}{% unless forloop.last %}
        {% capture this_word %}{{ tags_list[item] | strip_newlines }}{% endcapture %}
      <a href="{{ this_word | slugify | downcase }}" class="page__taxonomy-item" rel="tag">{{ this_word }} - <span class="count">{{ site.tags[this_word].size }}</span></a>
      {% endunless %} {% endfor %}
    </span>
  </p>
</div>
<!-- End tag array header -->
