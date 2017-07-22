package com.hyfo.tanch.hyfo.Tools;

import com.google.gson.Gson;
import com.hyfo.tanch.hyfo.Models.Book;
import com.hyfo.tanch.hyfo.Models.Chapter;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
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
            content=content.substring(content.lastIndexOf("</div>")+"</div>".length());
            return content;

        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }

    }
}
