package com.hyfo.tanch.hyfo;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.hyfo.tanch.hyfo.Tools.JsTool;

public class MainActivity extends Activity {
    WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //透明状态栏
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);

        webView = (WebView) findViewById(R.id.webView);
        InitWebView(webView,"file:///android_asset/index.html");
        //InitWebView(webView,"http://www.baidu.com");
    }

    private void InitWebView(final WebView wv, String defaultUrl) {
        WebSettings webSettings = wv.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSaveFormData(false);
        webSettings.setSupportZoom(false);
        WebView.setWebContentsDebuggingEnabled(true);
        //  重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
        wv.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                wv.loadUrl(request.getUrl().toString());
                return true;
            }
        });

        //设置chrome，调用js
        wv.setWebChromeClient(new WebChromeClient());

        //注册jstool类型，html调用
        wv.addJavascriptInterface(new JsTool(wv),"android");

        //加载默认地址
        if (!defaultUrl.isEmpty())
            wv.loadUrl(defaultUrl);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack())
        {
            webView.goBack();
        }else
        {
            super.onBackPressed();
        }

    }
}
