<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%><%@ 
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="Xproer.*" %><%@ 
	page import="java.net.URLDecoder" %><%@ 
	page import="java.net.URLEncoder" %><%@ 
	page import="org.apache.commons.lang.*" %><%@ 
	page import="com.google.gson.FieldNamingPolicy" %><%@ 
	page import="com.google.gson.Gson" %><%@ 
	page import="com.google.gson.GsonBuilder" %><%@ 
	page import="com.google.gson.annotations.SerializedName" %><%@ 
	page import="java.io.*" %><%
/*
	获取未下载完的文件和文件夹任务。
	主要从down_files,down_folders数据表中读取数据。
	更新记录：
		2015-05-13
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String uid 		 = request.getParameter("uid");
String mac		 = request.getParameter("mac");

if (StringUtils.isBlank(uid)
	||StringUtils.isBlank(mac)
	)
{
	out.write("参数为空 ");
	return;
}

String json = DnFile.GetAll(Integer.parseInt(uid),mac);

json = URLEncoder.encode(json,"utf-8");
json = json.replaceAll("\\+","%20");
out.write(json);
%>