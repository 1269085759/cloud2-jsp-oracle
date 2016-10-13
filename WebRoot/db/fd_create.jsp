<%@ page language="java" import="Xproer.*" pageEncoding="UTF-8"%><%@
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="com.google.gson.*" %><%@
	page import="Xproer.*" %><%@
	page import="Xproer.biz.*" %><%@
	page import="net.sf.json.*" %><%@
	page import="org.apache.commons.lang.StringUtils" %><%@
	page import="java.net.URLDecoder" %><%@
	page import="java.net.URLEncoder" %><%@
	page import="java.util.ArrayList" %><%@
	page import="java.util.HashMap" %><%@
	page import="java.util.Map" %><%
/*
	以md5模式上传文件夹，不在服务端创建层级结构，在数据库中保存层级信息。
	客户端上传的文件夹JSON格式：
    [
	     [name:"soft"		    //文件夹名称
	     ,pid:0                //父级ID
	     ,idLoc:0              //文件夹ID，客户端定义
	     ,idSvr:0              //文件夹ID，与数据库中的xdb_folder.fd_id对应。
	     ,length:"102032"      //数字化的文件夹大小，以字节为单位
	     ,size:"10G"           //格式化的文件夹大小
	     ,pathLoc:"d:\\soft"   //文件夹在客户端的路径
	     ,pathSvr:"e:\\web"    //文件夹在服务端的路径
	     ,foldersCount:0       //子文件夹总数
	     ,filesCount:0         //子文件总数
	     ,filesComplete:0      //已上传完成的子文件总数
	     ,folders:[
	           {name:"img1",pidLoc:0,pidSvr:10,idLoc:1,idSvr:0,pathLoc:"D:\\Soft\\img1",pathSvr:"E:\\Web"}
	          ,{name:"img2",pidLoc:1,pidSvr:10,idLoc:2,idSvr:0,pathLoc:"D:\\Soft\\image2",pathSvr:"E:\\Web"}
	          ,{name:"img3",pidLoc:2,pidSvr:10,idLoc:3,idSvr:0,pathLoc:"D:\\Soft\\image2\\img3",pathSvr:"E:\\Web"}
	          ]
	     ,files:[
	           {name:"f1.exe",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ,{name:"f2.exe",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ,{name:"f3.exe",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ,{name:"f4.rar",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ]
	]

	更新记录：
		2014-07-23 创建
		2014-08-05 修复BUG，上传文件夹如果没有子文件夹时报错的问题。
		2015-07-30 将子文件命名方式改为 md5 方式，不再使用原文件名称存储，防止冲突。
		2016-04-09 完善存储逻辑。

	JSON格式化工具：http://tool.oschina.net/codeformat/json
	POST数据过大导致接收到的参数为空解决方法：http://sishuok.com/forum/posts/list/2048.html
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String jsonTxt = request.getParameter("folder");
String uidTxt = request.getParameter("uid");

jsonTxt = jsonTxt.replace("+","%20");
//客户端使用的是encodeURIComponent编码，
jsonTxt = URLDecoder.decode(jsonTxt,"UTF-8");//utf-8解码


//参数为空
if (	StringUtils.isBlank(jsonTxt)
	||	StringUtils.isBlank(uidTxt) )
{
	out.write("param is null\n");
	return;
}
JSONObject jsonSrc = JSONObject.fromObject(jsonTxt);

//文件夹ID，文件夹对象
Map<String,FolderInf> tbFolders = new HashMap<String,FolderInf>();

Gson g = new Gson();
JsonParser parser = new JsonParser();//初始化解析json格式的对象
JsonObject folderSrc = parser.parse(jsonTxt).getAsJsonObject();
XDebug.Output("jsonTxt",jsonTxt);

JsonArray jarFolders = new JsonArray();
if(null != folderSrc.get("folders"))
{
	jarFolders = folderSrc.get("folders").getAsJsonArray();
}
//XDebug.Output("strFolders",strFolders);

JsonArray jarFiles = new JsonArray();
if( null != folderSrc.get("files"))
{
	jarFiles = folderSrc.get("files").getAsJsonArray();
}
//XDebug.Output("strFiles",strFiles);
folderSrc.remove("folders");
folderSrc.remove("files");
//FolderInf fdroot = (FolderInf)JSONObject.toBean(jsonSrc,FolderInf.class);
FolderInf fdroot = g.fromJson(folderSrc,FolderInf.class);
fdroot.pathRel = fdroot.nameLoc;//
fdroot.idSvr = DBFolder.Add(fdroot);//添加到数据库
fdroot.idFile = DBFile.Add(fdroot);//向文件表添加一条数据
tbFolders.put("0", fdroot);//提供给子文件夹使用

//解析文件夹
ArrayList<FolderInf> arrFolders = new ArrayList<FolderInf>();
for(int i = 0 ; i < jarFolders.size() ; ++i)
{
	JsonElement obj  = jarFolders.get(i);
	XDebug.Output("Folder",obj.toString());
	FolderInf folder = g.fromJson(obj,FolderInf.class);
	folder.uid 		 = Integer.parseInt(uidTxt);
	folder.pidRoot 	 = fdroot.idSvr;//add(2015-05-13):根级ID，为下载控件提供支持
	//查找父级文件夹
	FolderInf fdParent = (FolderInf)tbFolders.get(Integer.toString(folder.pidLoc));
	//folder.CreateDirectory(fdParent.pathSvr);
	folder.pathRel 	= fdParent.pathRel + "\\" + folder.nameLoc;//相对路径，提供给下载控件使用
	folder.pidSvr 	= fdParent.idSvr;
	folder.idSvr 	= DBFolder.Add(folder);//添加到数据库
	tbFolders.put(Integer.toString(folder.idLoc), folder);
	arrFolders.add(folder);
}

DBFile db = new DBFile();
xdb_files f_exist = new xdb_files();
//解析文件
ArrayList<FileInf> arrFiles = new ArrayList<FileInf>();
for(int i = 0 ; i < jarFiles.size() ; ++i)
{
	JsonElement obj  = jarFiles.get(i);
	FileInf file 	 = g.fromJson(obj,FileInf.class);
	FolderInf folder = (FolderInf)tbFolders.get(Integer.toString(file.pidLoc));
	file.uid 		 = Integer.parseInt(uidTxt);
	file.pidRoot 	 = fdroot.idSvr;
	file.pidSvr 	 = folder.idSvr;
	file.nameSvr 	 = file.md5 + "." + PathTool.getExtention(file.pathLoc).toLowerCase(); 
    
	//生成文件路径
	PathMd5Builder pb = new PathMd5Builder();
	file.pathSvr = pb.genFile(file.uid,file.md5,file.nameLoc);

	//有相同文件
	if(db.exist_file(file.md5,f_exist))
	{
		file.lenSvr = f_exist.lenSvr;
		file.perSvr = f_exist.perSvr;
		file.pathSvr = f_exist.pathSvr;
		file.pathRel = f_exist.pathRel;
		file.postPos = f_exist.FilePos;
		file.complete = f_exist.complete;
		file.nameSvr = f_exist.nameSvr;
	}
	else
	{
		FileResumerPart fr = new FileResumerPart();
		fr.CreateFile(file.pathSvr);		
	}
	
	file.idSvr 		 = DBFile.Add(file);//将信息添加到数据库
	arrFiles.add( file );
}

//转换为JSON
JSONObject obj = JSONObject.fromObject(fdroot);
obj.put("folders", JSONArray.fromObject(arrFolders));//bug:本地文件路径\斜杠没有转换成两个
obj.put("files", JSONArray.fromObject(arrFiles));//bug:本地文件路径\斜杠没有转换成两个
obj.put("complete",false);

String json = obj.toString();
XDebug.Output("输出JSON",json);
json = URLEncoder.encode( json ,"UTF-8");
//UrlEncode会将空格解析成+号，
json = json.replace("+", "%20");

out.write(json);
%>