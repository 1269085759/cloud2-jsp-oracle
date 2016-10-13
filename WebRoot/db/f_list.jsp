<%@ page language="java" import="Xproer.DBFile" pageEncoding="UTF-8"%><%@
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="Xproer.XDebug" %><%@
	page import="org.apache.commons.lang.StringUtils" %><%@
	page import="java.net.URLEncoder" %><%
/*
	获取所有未上传完的文件和文件夹
	更新记录：
		2012-05-24 完善
		2012-06-29 增加创建文件逻辑，
		2016-01-08 规范JSON返回值格式
		2016-04-09 更新加载未完成列表的逻辑

	JSON格式化工具：http://tool.oschina.net/codeformat/json
*/
String uid = request.getParameter("uid");
String cbk = request.getParameter("callback");//jsonp


if(! StringUtils.isBlank(uid) )
{
	String json = DBFile.GetAllUnComplete2(Integer.parseInt(uid) );
	if(!StringUtils.isBlank(json))
	{
		XDebug.Output("编码前的JSON",json);
		json = URLEncoder.encode(json,"utf-8");
		json = json.replace("+","%20");
		XDebug.Output("编码后的JSON",json);
		out.write( cbk + "({\"value\":\""+json + "\"})" );
		return;
	}
}
out.write(cbk + "({\"value\":null})");
%>