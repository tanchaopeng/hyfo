package com.hyfo.tanch.hyfo.Tools;


import android.os.Handler;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.hyfo.tanch.hyfo.Models.Book;
import com.hyfo.tanch.hyfo.Models.Chapter;

/**
 * Created by tanch on 2017/7/2.
 */

public class JsTool {
    WebView webView;
    public  JsTool(WebView wv){
        webView=wv;
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
    public void Search(String key) {
        String ret = new bqg5200Class().Search(key);
        PostJs("LoadData",ret);
    }

    @JavascriptInterface
    public void GetBook(String json) {
        final Book obj=new Gson().fromJson(json,Book.class);
        new Handler().post(new Runnable() {
            @Override
            public void run() {
                String ret=new bqg5200Class().GetList(obj);
                PostJs("LoadData",ret);
            }
        });

    }

    @JavascriptInterface
    public void GetContent(String json) {
        Chapter obj=new Gson().fromJson(json,Chapter.class);
        String ret=new bqg5200Class().GetContent(obj);
        PostJs("LoadData",ret);
    }
}
