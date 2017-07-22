package com.hyfo.tanch.hyfo.Tools;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Created by tanch on 2017/7/17.
 */

public class DbHelper extends SQLiteOpenHelper {
    //数据库
    private SQLiteDatabase db;
    //数据库版本
    private final static int VERSION = 1;
    //数据库名称
    private final static String DB_NAME = "hyfo.db";
    //表创建语句
    private final static String CREATE_TBL = "create table %s(id integer primary key autoincrement, %s)";
    //构造函数初始化
    public DbHelper(Context context, String name, SQLiteDatabase.CursorFactory factory, int version) {
        super(context, name, factory, version);
    }
    public DbHelper(Context context, String name, int version) {
        super(context, name, null, version);
    }
    public DbHelper(Context context, String name) {
        super(context, name, null, VERSION);
    }
    public DbHelper(Context context) {
        super(context, DB_NAME, null, VERSION);
    }

    //创建数据库回调
    @Override
    public void onCreate(SQLiteDatabase db) {
        //String.format("javascript:%s('%s');",mthodName,json)
        this.db = db;
        System.out.println("创建数据库");
        String historyStr=String.format(CREATE_TBL,"THistory","bookName text,bookUrl text,bookImg text,bookDesc text,bookDesc text,chapterName text,chapterUrl text,time text");
        db.execSQL(historyStr);

        //String collectionStr=Stcring.format(CREATE_TBL,"TCollection","");
        //db.execSQL(collectionStr);
    }
    //更新数据库回调
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }

    //插入方法
    public void Insert(String tableName,ContentValues values){
        //获取SQLiteDatabase实例
        SQLiteDatabase db = getWritableDatabase();
        //插入数据库中
        db.insert(tableName, null, values);
        db.close();
    }

    //创建表
    public void CreateTable(String tableName,String cols)
    {
        String sqlStr=String.format(CREATE_TBL,tableName,cols);
        db.execSQL(sqlStr);
    }
    //查询方法
    public Cursor Query(String tableName){
        SQLiteDatabase db = getReadableDatabase();
        //获取Cursor
        Cursor c = db.query(tableName, null, null, null, null, null, null, null);
        return c;
    }

    //更新数据库的内容
    public void Update(String tableName,ContentValues values, String whereClause, String[]whereArgs){
        SQLiteDatabase db = getWritableDatabase();
        db.update(tableName, values, whereClause, whereArgs);
    }

    //关闭数据库
    public void Close(){
        if(db != null){
            db.close();
        }
    }
}
