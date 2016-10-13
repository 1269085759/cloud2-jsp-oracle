<%@ page language="java" import="Xproer.DBFolder" pageEncoding="UTF-8"%><%@
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="org.apache.commons.lang.StringUtils" %><%
/*
	此页面主要用来执行删除文件夹逻辑。
	只修改数据库中文件夹状态。
	更新记录：
		2014-07-24 创建
*/
String path = request.getContextPath();

String fid 			= request.getParameter("fid");
String uid 			= request.getParameter("uid");
String callback 	= request.getParameter("callback");//jsonp
int ret = 0;

//参数为空
if (	!StringUtils.isBlank(fid)
	||	!StringUtils.isBlank(uid) )
{
	DBFolder.Remove(Integer.parseInt(fid),Integer.parseInt(uid));
	ret = 1;
}
out.write(callback + "(" + ret + ")");
%>