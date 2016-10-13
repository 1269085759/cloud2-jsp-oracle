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
	创建一条下载记录，	
	更新记录：
		2015-05-13 创建
		2015-07-31 修复中文文件夹名称出现乱码的问题。
		2015-07-31 修复文件夹路径中出现乱码的问题。
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String uid 		 = request.getParameter("uid");
String fdID		 = request.getParameter("fdid");
String mac		 = request.getParameter("mac");
String name	 	 = request.getParameter("name");
name 		 	 = name.replaceAll("\\+","%20");//fix(2015-07-31):防止中文名称出现乱码
name			 = URLDecoder.decode(name,"UTF-8");//utf-8解码
String pathLoc	 = request.getParameter("pathLoc"); 
String callback  = request.getParameter("callback");//jsonp
pathLoc 		 = pathLoc.replaceAll("\\+","%20");
pathLoc			 = URLDecoder.decode(pathLoc,"UTF-8");//utf-8解码

if (StringUtils.isBlank(uid)
	||StringUtils.isBlank(mac)
	||StringUtils.isBlank(pathLoc)
	||StringUtils.isBlank(name)
	)
{
	out.write("参数为空 ");
	return;
}

DnFolderInf	inf = new DnFolderInf();
inf.m_uid 		= Integer.parseInt(uid);
inf.m_mac 		= mac;
inf.m_name 		= name;
inf.m_pathLoc 	= pathLoc;
inf.m_fdID 		= Integer.parseInt(fdID);
inf.m_fd_id		= DnFolder.Add(inf);

inf.m_idF 		= DnFile.Add(inf);//添加到下载列表

Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE).create();
String json = gson.toJson(inf);
json = URLEncoder.encode(json,"utf-8");
json = json.replaceAll("\\+","%20");
//json = callback + "(" + json + ")";//返回jsonp格式数据。
out.write(json);
%>