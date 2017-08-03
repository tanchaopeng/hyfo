package com.hyfo.tanch.hyfo.Tools;


import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.Handler;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.hyfo.tanch.hyfo.Models.Book;
import com.hyfo.tanch.hyfo.Models.Chapter;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by tanch on 2017/7/2.
 */

public class JsTool {
    WebView webView;
    DbHelper db;
    public  JsTool(WebView wv,DbHelper dbHelper){
        webView=wv;
        db=dbHelper;
    }
    //显示toast消息
    @JavascriptInterface
    public void ShowMsg(String msg)
    {
        Toast.makeText(webView.getContext(),msg,Toast.LENGTH_LONG).show();
    }

    //回调浏览器js
    private void PostJs(String mthodName,String json)
    {
        final String jsFun = String.format("javascript:%s('%s');",mthodName,json);
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.loadUrl(jsFun);
            }
        });
    }

    @JavascriptInterface
    public void LoadUrl(final String url)
    {
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.loadUrl(url);
            }
        });
    }

    @JavascriptInterface
    public void Search(final String key) {
        new Handler().post(new Runnable() {
            @Override
            public void run() {
                String ret = new bqg5200Class().Search(key);
                PostJs("LoadData",ret);
            }
        });

    }

    @JavascriptInterface
    public void GetBook(final String json) {
        new Handler().post(new Runnable() {
            @Override
            public void run() {
                Book obj=new Gson().fromJson(json,Book.class);
                String ret=new bqg5200Class().GetList(obj);
                PostJs("LoadData",ret);
            }
        });

    }

    @JavascriptInterface
    public void GetContent(final String json) {
        new Handler().post(new Runnable() {
            @Override
            public void run() {
                Chapter obj=new Gson().fromJson(json,Chapter.class);
                //AddHistory(obj);
                String ret=new bqg5200Class().GetContent(obj);
                AddHistory(obj);
                AddCollection(obj);
                PostJs("LoadData",ret);
            }
        });
    }

    @JavascriptInterface
    public void GetHomeData() {
        new Handler().post(new Runnable() {
            @Override
            public void run() {
               ArrayList<Chapter> data = GetHistory();
               String json=new Gson().toJson(data);
               PostJs("LoadData",json);
            }
        });
    }

    @JavascriptInterface
    public void CollectionBook(String json,Boolean status)
    {
        Chapter obj=new Gson().fromJson(json,Chapter.class);
        if (status)
            AddCollection(obj);
        else
            RemoveCollection(obj);
    }

    /**
     * 添加收藏
     * @param obj
     */
    private void AddCollection(Chapter obj)
    {
        Cursor c=db.Query("TCollection","bookName='"+obj.bookName+"'");
        if (c.getCount()>0){
            c.moveToFirst();
            String id =  c.getString(0);
            ContentValues values=new ContentValues();
            values.put("chapterTitle",obj.title);
            values.put("chapterLink",obj.url);
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            values.put("time",sdf.format(new Date(System.currentTimeMillis())));
            db.Update("TCollection",values,"id="+id,null);
            return;
        }
        ContentValues values=new ContentValues();
        values.put("bookName",obj.bookName);
        values.put("bookDesc",obj.bookDesc);
        values.put("bookImg",obj.bookImg);
        values.put("bookLink",obj.bookLink);
        values.put("chapterTitle",obj.title);
        values.put("chapterLink",obj.url);
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        values.put("time",sdf.format(new Date(System.currentTimeMillis())));
        db.Insert("TCollection",values);
    }
    /**
     * 移除收藏
     * @param obj
     */
    private void RemoveCollection(Chapter obj)
    {
        Cursor c=db.Query("TCollection","bookName='"+obj.bookName+"'");
        if (c.getCount()>0){
            c.moveToFirst();
            Integer id=c.getInt(0);
            db.Delete("TCollection",id);
        }
    }

    /**
     * 添加浏览历史
     * @param obj
     */
    private void AddHistory(Chapter obj)
    {
        ContentValues values=new ContentValues();
        values.put("bookName",obj.bookName);
        values.put("bookLink",obj.bookLink);
        values.put("title",obj.title);
        values.put("url",obj.url);
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        values.put("time",sdf.format(new Date(System.currentTimeMillis())));
        db.Insert("THistory",values);
    }

    private ArrayList<Chapter> GetHistory()
    {
        ArrayList<Chapter> ret =new ArrayList<Chapter>();
        Cursor cursor = db.Query("THistory");
        while (cursor.moveToNext())
        {
            Chapter chapter=new Chapter();
            chapter.bookName=cursor.getString(1);
            chapter.bookLink=cursor.getString(2);
            chapter.title=cursor.getString(3);
            chapter.url=cursor.getString(4);
            chapter.time=cursor.getString(5);
            ret.add(chapter);
        }
        return  ret;
    }


}
