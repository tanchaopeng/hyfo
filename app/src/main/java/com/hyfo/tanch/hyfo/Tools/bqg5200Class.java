package com.hyfo.tanch.hyfo.Tools;

import com.google.gson.Gson;
import com.hyfo.tanch.hyfo.Models.Book;
import com.hyfo.tanch.hyfo.Models.Chapter;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;

/**
 * Created by tanch on 2017/7/2.
 */

public class bqg5200Class {
    private static String host="http://www.bqg5200.com";
    private static  String searchUrl="http://zhannei.baidu.com/cse/search?s=17194782488582577862&nsid=&q=";

    public String Search(String key)
    {
        try {
            Document doc= Jsoup.connect(searchUrl+key).get();
            Elements ele = doc.select(".result-item");
            ArrayList<Book> list=new ArrayList<>();
            for (Element item: ele) {
                Book obj=new Book();
                obj.title=item.select(".result-item-title").text().trim();
                obj.desc=item.select(".result-game-item-desc").text().trim();
                obj.img=item.select("img").attr("src");
                obj.link=item.select("a").first().attr("href");
               // obj.desc=item.select(".result-game-item-desc").text().trim();
                list.add(obj);
            }
            String json=new Gson().toJson(list);
            return json;

        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    public String GetList(Book obj)
    {
        try {
            Document doc= Jsoup.connect(obj.link).get();
            Elements ele = doc.select("#readerlist a");
            ArrayList<Chapter> list=new ArrayList<Chapter>();
            Integer i=0;
            for (Element item: ele) {
                Chapter chapter=new Chapter();
                chapter.bookName=obj.title;
                chapter.bookLink=obj.link;
                chapter.bookDesc=obj.desc;
                chapter.bookImg=obj.img;
                chapter.title=item.text().trim();
                chapter.url=host+item.attr("href");
                chapter.index=i++;
                list.add(chapter);
            }
            String json=new Gson().toJson(list);
            return json;

        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    public String GetContent(Chapter obj)
    {
        try {
            Document doc= Jsoup.connect(obj.url).get();
            String content=doc.select("#content").html();

            obj.title=doc.select(".title h1").text().trim();
            content=content.substring(content.lastIndexOf("</div>")+"</div>".length());

            String headHtml=doc.head().html();
            //host链接
            Integer hostS=headHtml.indexOf("var index_page = \"")+"var index_page = \"".length();
            String hostStr=headHtml.substring(hostS,headHtml.indexOf("\";",hostS));
            //上一章
            Integer upS=headHtml.indexOf("var preview_page = \"")+"var preview_page = \"".length();
            String upLink=hostStr+headHtml.substring(upS,headHtml.indexOf("\";",upS));
            //下一章
            Integer nextS=headHtml.indexOf("var next_page = \"")+"var next_page = \"".length();
            String nextLink=hostStr+headHtml.substring(nextS,headHtml.indexOf("\";",nextS));

            obj.content=URLEncoder.encode(URLEncoder.encode(content,"utf-8"),"utf-8");
            if (upLink.contains(".html"))
                obj.upChapter=upLink;
            else
                obj.upChapter="";
            if (nextLink.contains(".html"))
                obj.nextChapter=nextLink;
            else
                obj.nextChapter="";

            String json=new Gson().toJson(obj);
            return json;

        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }

    }
}
