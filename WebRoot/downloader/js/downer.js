/*
版权所有(C) 2009-2015 荆门泽优软件有限公司
保留所有权利
官方网站：http://www.ncmem.com
官方博客：http://www.cnblogs.com/xproer
产品首页：http://www.ncmem.com/webplug/http-downloader/index.asp
在线演示：http://www.ncmem.com/products/http-downloader/demo/index.html
开发文档：http://www.cnblogs.com/xproer/archive/2011/03/15/1984950.html
升级日志：http://www.cnblogs.com/xproer/archive/2011/03/15/1985091.html
示例下载：http://l2.yunpan.cn/lk/Q8sYvBFX2ZCvR
文档下载：http://l2.yunpan.cn/lk/Q27XLcZmUmuxT
联系邮箱：1085617561@qq.com
联系QQ：1085617561
更新记录：
    2009-11-05 创建
	2014-02-27 优化版本号。
    2015-07-31 修复打开文件错误的问题。使用浏览器对象打开路径。
*/

//删除元素值
Array.prototype.remove = function (val)
{
    for (var i = 0, n = 0; i < this.length; i++)
    {
        if (this[i] != val)
        {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

function debugMsg(msg) { $("#msg").append("<p>"+msg+"</p>"); }

function FileDownloaderMgr()
{
    var _this = this;
    this.Config = {
    	 "Version"          : "1,2,56,31650"
    	,"Folder"           : "D:\\"
		, "Debug"           : false//调试模式
		, "LogFile"         : "f:\\log.txt"//日志文件路径。
		, "Company"         : "荆门泽优软件有限公司"
		, "License"         : ""//
        , "UrlCreate"       : "http://localhost:8080/Uploader6.2Oracle/downloader/db/f_create.jsp"
        , "UrlDel"          : "http://localhost:8080/Uploader6.2Oracle/downloader/db/f_del.jsp"
        , "UrlList"         : "http://localhost:8080/Uploader6.2Oracle/downloader/db/d_list.jsp"
        , "UrlListCmp"      : "http://localhost:8080/Uploader6.2Oracle/downloader/db/f_list_cmp.jsp"
        , "UrlUpdate"       : "http://localhost:8080/Uploader6.2Oracle/downloader/db/f_update.jsp"
        , "UrlDownload"     : "http://localhost:8080/Uploader6.2Oracle/downloader/db/f_down.jsp"
        //文件夹
        , "UrlFdCreate"     : "http://localhost:8080/Uploader6.2Oracle/downloader/db/fd_create.jsp"
        , "UrlFdJson"       : "http://localhost:8080/Uploader6.2Oracle/downloader/db/fd_json.jsp"
        , "UrlFdDel"        : "http://localhost:8080/Uploader6.2Oracle/downloader/db/fd_del.jsp"
        , "UrlFdUpdate"     : "http://localhost:8080/Uploader6.2Oracle/downloader/db/fd_update.jsp"
        //x86
		, "ClsidDown"       : "E94D2BA0-37F4-4978-B9B9-A4F548300E48"
		, "ClsidPart"       : "6528602B-7DF7-445A-8BA0-F6F996472569"
		, "CabPath"         : "http://www.ncmem.com/download/HttpDownloader/HttpDownloader.cab"
        //x64
		, "ClsidDown64"     : "0DADC2F7-225A-4cdb-80E2-03E9E7981AF8"
		, "ClsidPart64"     : "19799DD1-7357-49de-AE5D-E7A010A3172C"
		, "CabPath64"       : "http://www.ncmem.com/download/HttpDownloader/HttpDownloader64.cab"
        //Firefox
		, "MimeType"        : "application/npHttpDown"
		, "XpiPath"         : "http://www.ncmem.com/download/HttpDownloader/HttpDownloader.xpi"
        //Chrome
		, "CrxName"         : "npHttpDown"
		, "MimeTypeChr"     : "application/npHttpDown"
		, "CrxPath"         : "http://www.ncmem.com/download/HttpDownloader/HttpDownloader.crx"
		, "ExePath"         : "http://www.ncmem.com/download/HttpDownloader/HttpDownloader.exe"
    };

    this.ActiveX = {
        "Down"      : "Xproer.HttpDownloader"
		, "Part"    : "Xproer.DownloaderPartition"
        //64bit
		, "Down64"  : "Xproer.HttpDownloader64"
		, "Part64"  : "Xproer.DownloaderPartition64"
    };

    this.Fields = {
        "uid": 0
    };

    //检查版本 Win32/Win64/Firefox/Chrome
    _this.firefox = false;
    _this.ie = false;
    _this.chrome = false;

    var browserName = navigator.userAgent.toLowerCase();
    _this.ie = browserName.indexOf("msie") > 0;
    _this.ie = _this.ie ? _this.ie : browserName.search(/(msie\s|trident.*rv:)([\w.]+)/) != -1;
    _this.firefox = browserName.indexOf("firefox") > 0;
    _this.chrome = browserName.indexOf("chrome") > 0;

    this.CheckVersion = function ()
    {
        //Win64
        if (window.navigator.platform == "Win64")
        {
            _this.Config["CabPath"] = _this.Config["CabPath64"];

            _this.Config["ClsidDown"] = _this.Config["ClsidDown64"];
            _this.Config["ClsidPart"] = _this.Config["ClsidPart64"];

            _this.ActiveX["Down"] = _this.ActiveX["Down64"];
            _this.ActiveX["Part"] = _this.ActiveX["Part64"];
        } //Firefox
        else if (_this.firefox)
        {
            _this.Config["CabPath"] = _this.Config["XpiPath"];
        }
        else if (_this.chrome)
        {
            _this.Config["CabPath"] = _this.Config["CrxPath"];
            _this.Config["MimeType"] = _this.Config["MimeTypeChr"];
        }
    };
    _this.CheckVersion();

    this.FileFilter         = new Array();	//文件过滤器
    this.DownloadCount      = 0; 			//上传项总数
    this.DownloadList       = new Object();	//下载项列表
    this.DownloadQueue      = new Array();	//下载队列
    this.UnDownloadIdList   = new Array();	//未下载项ID列表
    this.DownloadIdList     = new Array();	//正在下载的ID列表
    this.CompleteList       = new Array();	//已下载完的列表
    this.iePool             = new Array();  //ActiveX缓存对象
    this.ffPool             = new Array();  //npapi缓存对象
    this.iePartition        = null;
    this.ffPartition        = null;

    this.GetHtml = function ()
    {
        //自动安装CAB
        var acx = '<div style="display:none">';
        /*
			IE静态加载代码：
			<object id="objDownloader" classid="clsid:E94D2BA0-37F4-4978-B9B9-A4F548300E48" codebase="http://www.qq.com/HttpDownloader.cab#version=1,2,22,65068" width="1" height="1" ></object>
			<object id="objPartition" classid="clsid:6528602B-7DF7-445A-8BA0-F6F996472569" codebase="http://www.qq.com/HttpDownloader.cab#version=1,2,22,65068" width="1" height="1" ></object>
		*/
        //下载控件
        acx += '<object id="objDownloader" classid="clsid:' + this.Config["ClsidDown"] + '"';
        acx += ' codebase="' + this.Config["CabPath"] + '#version=' + _this.Config["Version"] + '" width="1" height="1" ></object>';
        //文件夹选择控件
        acx += '<object name="objPartition" id="objPartition" classid="clsid:' + this.Config["ClsidPart"] + '"';
        acx += ' codebase="' + this.Config["CabPath"] + '#version=' + _this.Config["Version"] + '" width="1" height="1" ></object>';
        acx += '</div>';
        //上传列表项模板
        acx += '<div class="UploaderItem" name="fileItem" id="UploaderTemplate">\
					<div class="UploaderItemLeft">\
						<div class="FileInfo">\
							<div name="fileName" class="FileName top-space">HttpUploader程序开发.pdf</div>\
							<div name="fileSize" class="FileSize" child="1"></div>\
						</div>\
						<div class="ProcessBorder top-space"><div name="process" class="Process"></div></div>\
						<div name="msg" class="PostInf top-space">已上传:15.3MB 速度:20KB/S 剩余时间:10:02:00</div>\
					</div>\
					<div class="UploaderItemRight">\
						<div class="BtnInfo"><span name="btn" class="Btn">取消</span></div>\
						<div name="percent" class="ProcessNum">35%</div>\
					</div>\
				</div>';
        //文件夹模板
        acx += '<div class="UploaderItem" id="tmpFolder" name="folderItem">\
					<div class="UploaderItemLeft">\
						<div class="FileInfo">\
							<span class="folder-pic"></span>\
							<div name="fileName" class="FileName top-space">HttpUploader程序开发.pdf</div>\
							<div name="fileSize" class="FileSize" child="1">100.23MB</div>\
						</div>\
						<div class="ProcessBorder top-space"><div name="process" class="Process"></div></div>\
						<div name="msg" class="PostInf top-space">已上传:15.3MB 速度:20KB/S 剩余时间:10:02:00</div>\
					</div>\
					<div class="UploaderItemRight">\
						<div class="BtnInfo"><span name="btnCancel" class="Btn">取消</span>&nbsp;<span name="btnDel" class="Btn hide">删除</span></div>\
						<div name="percent" class="ProcessNum">35%</div>\
					</div>';
        acx += '</div>';
        //分隔线
        acx += '<div name="spliter" class="Line" id="FilePostLine"></div>';
        //上传列表
        acx += '<div class="UploaderPanel">\
					<div class="header">下载文件</div>\
					<div class="toolbar">\
						<input name="btnSetFD" id="btnSetFolder" type="button" value="设置下载目录" />\
					</div>\
					<div class="content">\
						<div name="fileList" class="FilePostLister"></div>\
					</div>\
					<div class="footer"></div>\
				</div>';
        return acx;
    };

    //IE浏览器信息管理对象
    this.BrowserIE = {
        "Check": function ()//检查插件是否已安装
        {
            try
            {
                var com = new ActiveXObject(_this.ActiveX["Down"]);
                return true;
            }
            catch (e) { return false; }
        }
		, "Setup": function ()//安装插件
		{
		}
		, "CopyFile": function (src, dst)//复制文件
		{
		    var obj = this.plugin;
		    obj.CopyFile(src, dst);
		}
		, "MoveFile": function (src, dst)//移动文件
		{
		    var obj = this.plugin;
		    obj.MoveFile(src, dst);
		}
		, "OpenPath": function (path)//打开文件夹
		{
		    var obj = this.plugin;
		    obj.OpenPath(path);
		}
		, "OpenFolderDialog": function ()
		{
		    var obj = this.plugin;
		    obj.InitPath = _this.Config["Folder"];
		    if (!obj.ShowFolder()) return;

		    _this.Config["Folder"] = obj.Folder;
		}
        , "GetMacs": function ()
        {
            var list = this.plugin.GetMacs();//是一个JSON数据            
            if (list == null) return null;
            if (list.lbound(1) == null) return null;

            for (var index = list.lbound(1) ; index <= list.ubound(1) ; index++)
            {
                return list.getItem(index);
            }
            return "0";
        }
        , "SaveFolder": function (path, json, idsCmp)
        {
            this.plugin.SaveFolder(path, json, idsCmp);
        }
        , "LoadFolder": function (path)
        {
            //返回JSON数据：{name:"test",path:"d:\\my\\folder1.cfg",data:"文件夹JSON",idsComplete:"1,2,3,4,5,6,7"}
            return this.plugin.LoadFolder(path);
        }
        , "DelFdCfg": function (path) { this.plugin.DelFdCfg(path); }
		, "Init": function ()
		{
		    this.plugin = _this.iePartition;
		}
    };
    //FireFox浏览器信息管理对象
    this.BrowserFF = {
        "Check": function ()//检查插件是否已安装
        {
            var mimetype = navigator.mimeTypes;
            if (typeof mimetype == "object" && mimetype.length)
            {
                for (var i = 0; i < mimetype.length; i++)
                {
                    if (mimetype[i].type == _this.Config["MimeType"].toLowerCase())
                    {
                        return mimetype[i].enabledPlugin;
                    }
                }
            }
            else
            {
                mimetype = [_this.Config["MimeType"]];
            }
            if (mimetype)
            {
                return mimetype.enabledPlugin;
            }
            return false;
        }
		, "Setup": function ()//安装插件
		{
		    var xpi = new Object();
		    xpi["Calendar"] = _this.Config["XpiPath"];
		    InstallTrigger.install(xpi, function (name, result) { });
		}
		, "CopyFile": function (src, dst)//复制文件
		{
		    var obj = this.plugin;
		    obj.CopyFile(src, dst);
		}
		, "MoveFile": function (src, dst)//移动文件
		{
		    var obj = this.plugin;
		    obj.MoveFile(src, dst);
		}
		, "OpenPath": function (path)//打开路径
		{
		    var obj = this.plugin;
		    obj.OpenPath(path);
		}
		, "OpenFolderDialog": function ()//设置下载目录
		{
			this.plugin.InitPath = _this.Config["Folder"];
		    if (!this.plugin.ShowFolder()) return;
		    _this.Config["Folder"] = this.plugin.GetFolder();
		}
        , "GetMacs": function ()
        {
            var obj = this.plugin.GetMacs();//是一个JSON数据
            return obj[0];
        }
        , "SaveFolder": function (path, json, idsCmp)
        {
            this.plugin.SaveFolder(path, json, idsCmp);
        }
        , "LoadFolder": function (path)
        {
            //返回JSON数据：{name:"test",path:"d:\\my\\folder1.cfg",data:"文件夹JSON",idsComplete:"1,2,3,4,5,6,7"}
            return this.plugin.LoadFolder(path);
        }
        , "DelFdCfg": function (path) { this.plugin.DelFdCfg(path); }
		, "Init": function ()//初始化控件
		{
		    var atl 			= _this.FirefoxAtl;
		    atl.Licensed 		= _this.Config["Company"];
		    atl.License 		= _this.Config["License"];
		    atl.InitPath 		= _this.Config["Folder"];
		    atl.Debug 			= _this.Config["Debug"];
		    atl.LogFile 		= _this.Config["LogFile"];
		    atl.OnConnected 	= HttpDownloader_Connected;
		    atl.OnComplete 		= HttpDownloader_Complete;
		    atl.OnPost 			= HttpDownloader_Process;
		    atl.OnError 		= HttpDownloader_Error;
		    atl.OnGetFileSize 	= HttpDownloader_GetFileSize;
		    atl.OnGetFileName 	= HttpDownloader_GetFileName;
		    atl.OnBeginDown 	= HttpDownloader_BeginDown;
		    this.plugin 		= atl;
		}
    };
    //Chrome浏览器
    this.BrowserChrome = {
        "Check": function ()//检查插件是否已安装
        {
            for (var i = 0, l = navigator.plugins.length; i < l; i++)
            {
                if (navigator.plugins[i].name == _this.Config["CrxName"])
                {
                    return true;
                }
            }
            return false;
        }
		, "Setup": function ()//安装插件
		{
		    document.write('<iframe style="display:none;" src="' + _this.Config["CrxPath"] + '"></iframe>');
		}
		, "CopyFile": function (src, dst)//复制文件
		{
		    var obj = this.plugin;
		    obj.CopyFile(src, dst);
		}
		, "MoveFile": function (src, dst)//移动文件
		{
		    var obj = this.plugin;
		    obj.CopyFile(src, dst);
		    
		}
		, "OpenPath": function (path)
		{
		    var obj = this.plugin;
		    obj.OpenPath(path);
		}
		, "OpenFolderDialog": function ()//设置下载目录
		{
			this.plugin.InitPath = _this.Config["Folder"];
		    if (!this.plugin.ShowFolder()) return;
		    _this.Config["Folder"] = this.plugin.GetFolder();
		}
        , "GetMacs": function ()
        {
            var obj = this.plugin.GetMacs();//是一个JSON数据
            return obj[0];
        }
        , "SaveFolder": function (path, json, idsCmp)
        {
            this.plugin.SaveFolder(path, json, idsCmp);
        }
        , "LoadFolder": function (path)
        {
            //返回JSON数据：{name:"test",path:"d:\\my\\folder1.cfg",data:"文件夹JSON",idsComplete:"1,2,3,4,5,6,7"}
            return this.plugin.LoadFolder(path);
        }
        , "DelFdCfg": function (path) { this.plugin.DelFdCfg(path); }
		, "Init": function ()//初始化控件
		{
		    this.plugin 		= _this.FirefoxAtl;
		    var atl 			= this.plugin;
		    atl.Licensed 		= _this.Config["Company"];
		    atl.License 		= _this.Config["License"];
		    atl.InitPath 		= _this.Config["Folder"];
		    atl.Debug 			= _this.Config["Debug"];
		    atl.LogFile 		= _this.Config["LogFile"];
		    atl.OnConnected 	= HttpDownloader_Connected;
		    atl.OnComplete 		= HttpDownloader_Complete;
		    atl.OnPost 			= HttpDownloader_Process;
		    atl.OnError 		= HttpDownloader_Error;
		    atl.OnGetFileSize 	= HttpDownloader_GetFileSize;
		    atl.OnGetFileName 	= HttpDownloader_GetFileName;
		    atl.OnBeginDown 	= HttpDownloader_BeginDown;
		}
    };

    _this.Browser = this.BrowserIE;
    //Firefox
    if (_this.firefox)
    {
        _this.Browser = this.BrowserFF;
        if (!_this.Browser.Check()) { _this.Browser.Setup(); }
    } //Chrome
    else if (_this.chrome)
    {
        _this.Browser = this.BrowserChrome;
        if (!_this.Browser.Check()) { _this.Browser.Setup(); }
    }

    //安全检查，在用户关闭网页时自动停止所有上传任务。
    this.SafeCheck = function ()
    {
        $(window).bind("beforeunload", function ()
        {
            if (_this.DownloadIdList.length > 0)
            {
                event.returnValue = "您还有程序正在运行，确定关闭？";
            }
        });

        $(window).bind("unload", function ()
        {
            if (_this.DownloadIdList.length > 0)
            {
                _this.StopAll();
            }
        });
    };

    //已弃用
    this.Load = function ()
    {
        var html = this.GetHtml();
        html += '<embed name="objHttpDownFF" id="objHttpDownFF" type="' + this.Config["MimeType"] + '" pluginspage="' + this.Config["XpiPath"] + '" width="1" height="1"/>';
        var dom = $(document.body).append(html);

        var fileList = dom.find('div[name="fileList"]');
        var fileItem = dom.find('div[name="fileItem"]');
        var fdItem   = dom.find('div[name="folderItem"]');
        var spliter  = dom.find('div[name="spliter"]');
        var npapi    = dom.find('embed[name="objHttpDownFF"]').get(0);
        var iePart   = dom.find('object[name="objPartition"]').get(0);
        var btnSetFD = dom.find('input[name="btnSetFD"]');
        
        this.UploaderListDiv    = fileList;
        this.fileItem           = fileItem;
        this.folderItem         = fdItem;
        this.spliter            = spliter;
        this.FirefoxAtl         = npapi;
        this.iePartition        = iePart;
        btnSetFD.click(function () { _this.OpenFolderDialog(); });

        _this.Browser.Init(); //
        this.LoadData();
    };

    //加截到指定控件
    this.LoadTo = function (id)
    {
        var html = this.GetHtml();
        html += '<embed name="objHttpDownFF" id="objHttpDownFF" type="' + this.Config["MimeType"] + '" pluginspage="' + this.Config["XpiPath"] + '" width="1" height="1"/>';
        var dom = $("#" + id).append(html);

        var fileList = dom.find('div[name="fileList"]');
        var fileItem = dom.find('div[name="fileItem"]');
        var fdItem   = dom.find('div[name="folderItem"]');
        var spliter  = dom.find('div[name="spliter"]');
        var npapi    = dom.find('embed[name="objHttpDownFF"]').get(0);
        var iePart   = dom.find('object[name="objPartition"]').get(0);
        var btnSetFD = dom.find('input[name="btnSetFD"]');
        
        this.UploaderListDiv    = fileList;
        this.fileItem           = fileItem;
        this.folderItem         = fdItem;
        this.spliter            = spliter;
        this.FirefoxAtl         = npapi;
        this.iePartition        = iePart;
        btnSetFD.click(function () { _this.OpenFolderDialog(); });

        _this.Browser.Init(); //
        this.LoadData();
        this.SafeCheck();//
    };

    //初始化，一般在window.onload中调用（已弃用）
    this.Init = function ()
    {
        //this.UploaderListDiv = document.getElementById("FilePostLister");
        //this.fileItem = document.getElementById("UploaderTemplate");
        //this.FirefoxAtl = document.getElementById("objHttpDownFF");
        //_this.Browser.Init(); //
        //设置下载文件夹
        //$("#btnSetFolder").click(function () { _this.OpenFolderDialog(); });

        //this.LoadData();
    };

    //加载未未完成列表
    this.LoadData = function ()
    {
        $.ajax({
            type: "GET"
            //, dataType: 'jsonp'
            //, jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlList"]
            , data: { uid: _this.Fields["uid"], mac: _this.Browser.GetMacs(), time: new Date().getTime() }
            , success: function (msg)
            {
                var json = eval("(" + decodeURIComponent(msg) + ")");
                $.each(json, function (i, item)
                {
                    //文件夹
                    if (item.fdTask)
                    {
                        var fd      = _this.AddFolder(item.fdID, item.name);
                        fd.idSvr    = item.fdID;
                        fd.idSvrF   = item.idSvr;
                        fd.idSvrFD  = item.fdID;
                        fd.cfgPath  = item.pathLoc;
                        fd.LoadCfg();//
                        fd.pFileSize.text(fd.fdRoot.size);
                        fd.pButton.text("续传");
                        fd.pPercent.text(item.percent);
                        fd.pProcess.width(item.percent);
                    }//文件
                    else
                    {
                        var obj = _this.AddFile(item.pathSvr);
                        obj.idSvr = item.idSvr;
                        obj.LocalFilePath = item.pathLoc;
                        var nameArr = item.pathLoc.split("\\");
                        var name = nameArr[nameArr.length - 1];
                        obj.pFileName.text(name);
                        obj.pButton.text("续传");
                        obj.pPercent.text(item.percent);
                        obj.pProcess.css("width", item.percent);
                        obj.pFileName.text(item.name);
                    }
                    
                    //item.idSvr;
                    //item.uid;
                    //item.mac;
                    //item.pathLoc;
                    //item.pathSvr;
                    //item.lengthLoc;
                });
                //_this.PostFirst();
            }
            , error: function (req, txt, err) { alert("加载数据失败！" + req.responseText); }
            , complete: function (req, sta) { req = null; }
        });
    };

    //上传队列是否已满
    this.IsPostQueueFull = function ()
    {
        //目前只支持同时下载三个文件
        if (this.DownloadIdList.length >= 3)
        {
            return true;
        }
        return false;
    };

    //添加一个上传ID
    this.AppendUploadId = function (fid)
    {
        this.DownloadIdList.push(fid);
    };

    this.AddTaskWorking = function (idLoc)
    {
        for (a in this.DownloadIdList)
        {
            if (a == idLoc) return;
        }
        this.DownloadIdList.push(idLoc);
    };
    this.DelTaskWorking = function (idLoc)
    {
        if (this.DownloadIdList.length == 0) return;
        this.DownloadIdList.remove(idLoc);
    };
    this.AddTask = function (idLoc)
    {
        for (a in this.UnDownloadIdList)
        {
            if (a == idLoc) return;
        }
        this.UnDownloadIdList.push(idLoc);
    };
    this.DelTask = function (idLoc)
    {
        if (this.UnDownloadIdList.length == 0) return;
        this.UnDownloadIdList.remove(idLoc);
    };

    //停止所有上传项
    this.StopAll = function ()
    {
        for (var i = 0, l = this.DownloadIdList.length; i < l; ++i)
        {
            var id = this.DownloadIdList[i];
            this.DownloadList[id].Stop();
            //this.UnDownloadIdList.push(id);
            this.AddTask(id);
        }
        this.DownloadIdList.length = 0;
    };

    /*
	添加到上传列表
	参数
	fid 上传项ID
	uploaderItem 新的上传对象
	*/
    this.AppenToUploaderList = function (fid, uploaderItem)
    {
        this.DownloadList[fid] = uploaderItem;
        this.DownloadCount++;
    };

    //传送当前队列的第一个文件
    this.PostFirst = function ()
    {
        //未上传列表不为空
        if (this.UnDownloadIdList.length > 0)
        {
            //同时上传三个任务
            while (this.UnDownloadIdList.length > 0
				&& !this.IsPostQueueFull())
            {
                //上传队列已满
                if (this.IsPostQueueFull()) return;
                var index = this.UnDownloadIdList.shift();
                this.DownloadList[index].Download();
            }
        }
    };

    /*
	验证文件名是否存在
	参数:
	[0]:文件名称
	*/
    this.Exist = function (url)
    {
        for (a in this.DownloadList)
        {
            if (this.DownloadList[a].FileUrl == url)
            {
                return true;
            }
        }
        return false;
    };

    /*
	根据ID删除上传任务
	参数:
	fid 上传项ID。唯一标识
	*/
    this.Delete = function (fid)
    {
        var obj = this.DownloadList[fid];
        if (null == obj) return;

        //删除div
        document.removeChild(obj.div);
        //删除分隔线
        document.removeChild(obj.spliter);
    };

    /*
	设置文件过滤器
	参数：
	filter 文件类型字符串，使用逗号分隔(exe,jpg,gif)
	*/
    this.SetFileFilter = function (filter)
    {
        this.FileFilter.length = 0;
        this.FileFilter = filter.split(",");
    };

    /*
	判断文件类型是否需要过滤
	根据文件后缀名称来判断。
	*/
    this.NeedFilter = function (fname)
    {
        if (this.FileFilter.length == 0) return false;
        var exArr = fname.split(".");
        var len = exArr.length;
        if (len > 0)
        {
            for (var i = 0, l = this.FileFilter.length; i < l; ++i)
            {
                //忽略大小写
                if (this.FileFilter[i].toLowerCase() == exArr[len - 1].toLowerCase())
                {
                    return true;
                }
            }
        }
        return false;
    };

    //打开文件夹选择对话框
    this.OpenFolderDialog = function ()
    {
        _this.Browser.OpenFolderDialog();
    };

    /*
    添加一个文件到上传队列
    参数:
	    url			远程文件地址
	    fileName	自定义下载文件名称
    */
    this.AddFile = function (url)
    {
        //本地文件名称存在
        if (this.Exist(url)) return;
        //此类型为过滤类型
        //if (this.NeedFilter(url)) return;

        var _this = this;
        var fileNameArray = url.split("/");
        var fileName = fileNameArray[fileNameArray.length - 1];
        //自定义文件名称
        if (typeof (arguments[1]) == "string")
        {
            fileName = arguments[1];
        }
        var fid = this.DownloadCount;
        this.AddTask(fid);

        var downer = new FileDowner(fid, url, this);
        var ui = this.fileItem.clone();
        this.UploaderListDiv.append(ui);
        ui.css("display", "block");
        ui.attr("id", "item" + fid);
        var objFileName = ui.find("div[name='fileName']")
        var objFileSize = ui.find("div[name='fileSize']");
        var objProcess = ui.find("div[name='process']");
        var objMsg = ui.find("div[name='msg']");
        var objBtn = ui.find("span[name='btn']");
        var objPercent = ui.find("div[name='percent']");

        objFileName.text(fileName);
        objFileName.attr("title", url);
        var fileSize = objFileSize;
        //fileSize.innerText = downer.FileSize;
        downer.pFileName = objFileName;
        downer.pFileSize = fileSize;
        downer.pProcess = objProcess;
        downer.pMsg = objMsg;
        downer.pMsg.text("");
        downer.pButton = objBtn;
        objBtn.attr("fid", fid)
                .attr("domid", "item" + fid)
                .attr("lineid", "FilePostLine" + fid)
                .click(function ()
                {
                    switch (objBtn.text())
                    {
                        case "暂停":
                        case "停止":
                            downer.Stop();
                            _this.DelTaskWorking(fid);
                            _this.AddTask(fid);
                            break;
                        case "取消":
                            {                                
                                downer.Stop();
                                downer.Delete();
                                _this.DelTaskWorking(fid);
                                _this.DelTask(fid);
                            }
                            break;
                        case "续传":
                        case "重试":
                            downer.Download();
                            _this.AddTaskWorking(fid);
                            _this.DelTask(fid);
                            break;
                        case "打开":
                            downer.OpenPath();
                    }
                });
        downer.pPercent = objPercent;
        downer.pPercent.text("0%");
        //自定义下载文件名称
        //downer.ATL.SetFileName(fileName);
        downer.FileNameLoc = fileName;

        //添加到上传列表
        this.AppenToUploaderList(fid, downer);
        //添加到上传列表层
        var split = this.spliter.clone();
        split.css("display", "block");
        this.UploaderListDiv.append(split);
        downer.div = ui;
        downer.spliter = split;
        //downer.Post(); //开始上传
        downer.Ready(); //准备
        return downer;
    };

    this.AddFolder = function (fdID,name)
    {
        //防止重复下载文件夹
        if (this.Exist(name)) return;

        var idLoc = this.DownloadCount;
        this.AddTask(idLoc);

        var downer = new FolderDowner(idLoc, fdID, name,this);
        var ui = this.folderItem.clone();
        this.UploaderListDiv.append(ui);
        ui.css("display", "block");
        ui.attr("id", "item" + idLoc);
        var objFileName = ui.find("div[name='fileName']")
        var objFileSize = ui.find("div[name='fileSize']");
        var objProcess  = ui.find("div[name='process']");
        var objMsg      = ui.find("div[name='msg']");
        var objBtn      = ui.find("span[name='btnCancel']");
        var uiBtnDel    = ui.find("span[name='btnDel']");
        var objPercent  = ui.find("div[name='percent']");

        objFileName.text(name);
        objFileName.attr("title", name);
        var fileSize        = objFileSize;
        //fileSize.innerText = downer.FileSize;
        downer.pFileName    = objFileName;
        downer.pFileSize    = fileSize;
        downer.pProcess     = objProcess;
        downer.pMsg         = objMsg;
        downer.pMsg.text("");
        downer.pBtnDel = uiBtnDel;
        uiBtnDel.click(function ()
        {
            downer.Stop();
            downer.Delete();
            _this.DelTask(idLoc);
            _this.DelTaskWorking(idLoc);
        });
        downer.pButton = objBtn;
        objBtn.text("续传");
        objBtn.attr("fid", idLoc)
                .attr("domid", "item" + idLoc)
                .attr("lineid", "FilePostLine" + idLoc)
                .click(function ()
                {
                    switch (objBtn.text())
                    {
                        case "暂停":
                        case "停止":
                            downer.Stop();
                            _this.AddTask(idLoc);
                            _this.DelTaskWorking(idLoc);
                            break;
                        case "取消":
                            {
                                downer.Stop();
                                downer.Delete();
                                _this.DelTask(idLoc);
                                _this.DelTaskWorking(idLoc);
                            }
                            break;
                        case "续传":
                        case "重试":
                            downer.Download();
                            _this.DelTask(idLoc);
                            _this.AddTaskWorking(idLoc);
                            break;
                        case "打开":
                            downer.OpenPath();
                    }
                });
        downer.pPercent = objPercent;
        downer.pPercent.text("0%");
        //自定义下载文件名称
        //downer.ATL.SetFileName(fileName);
        downer.name = name;

        //添加到上传列表
        this.AppenToUploaderList(idLoc, downer);
        //添加到上传列表层
        var split = this.spliter.clone();
        split.css("display", "block");
        this.UploaderListDiv.append(split);
        downer.div = ui;
        downer.spliter = split;
        downer.Ready(); //准备
        return downer;
    }
}

//错误类型
var DownloadErrorCode = {
      "0": "连接服务器失败"
    , "1": "URL地址为空"
    , "2": "获取远程文件错误"
    , "3": "未设置本地目录"
    , "4": "创建文件错误"
    , "5": "向本地文件写入数据失败"
    , "6": "公司未授权"
    , "7": "域名未授权"
    , "8": "文件大小超过限制"
    , "9": "文件夹是相对路径"
    , "10": "文件夹路径太长"
    , "11": "路径无效"
    , "12": "读取远程文件数据错误"
    , "13": "设置异步回调函数失败"
    //HTTP标准错误
    , "400": "错误请求"
    , "401": "未授权"
    , "402": "支付请求"
    , "403": "禁止访问"
    , "404": "未找到页面"
    , "405": "方法不允许"
    , "406": "不接受请求"
    , "407": "需要验证代码"
    , "408": "请求超时"
    , "409": "访问冲突"
    , "410": "已过时"
    , "411": "未指定请求内容长度"
    , "412": "前提条件失败"
    , "413": "请求内容过长"
    , "414": "请求地址过长"
    , "415": "不支持的媒体类型"
    , "416": "请求范围不符合要求"
    , "417": "预期失败"
    , "500": "内部服务错误"
    , "501": "未实现"
    , "502": "错误的网关"
    , "503": "服务不可用"
    , "504": "网关超时"
    , "505": "HTTP版本不支持"
};
//状态
var HttpDownloaderState = {
    Ready: 0,
    Posting: 1,
    Stop: 2,
    Error: 3,
    GetNewID: 4,
    Complete: 5,
    WaitContinueUpload: 6,
    None: 7,
    Waiting: 8
};
//
var FolderDownloader_obj = null;
function FolderDownloader_Next() { FolderDownloader_obj.DownNext();}
//文件夹下载对象
function FolderDowner(idLoc,fdID,name,mgr)
{
    var _this = this;
    this.Manager    = mgr;
    this.ActiveX    = mgr.ActiveX;
    this.Config     = mgr.Config;
    this.Fields     = mgr.Fields;
    this.Browser    = mgr.Browser;
    this.mac        = mgr.Browser.GetMacs();
    this.name       = name;
    this.State      = HttpDownloaderState.None;
    this.files      = new Array();//文件列表
    this.fileCount  = 0;//
    this.fileCur    = null;//当前上传项
    this.unCmpFiles = new Array();//未完成的文件列表ID。1,2,3,4
    this.filesMap   = new Object();//文件表：(idSvr,FileDownloader)
    this.idSvr      = 0;//与down_folders.fd_id对应
    this.idSvrF     = 0;//与down_files.f_id对应
    this.idSvrFD    = 0;//与down_folder.fd_id对应
    this.FileUrl    = name;//防止重复下载
    this.fdID       = fdID;//与down_folders.fd_id_old对应，xdb_folders.fd_id
    this.idLoc      = idLoc;
    this.pathLoc    = this.Config["Folder"] + "\\" + this.name;//本地路径。d:\\my\\test
    this.cfgPath    = this.pathLoc + ".cfg";//本地配置文件。d:\\my\\test.cfg
    this.fdJson     = "";//文件夹json字符串
    this.fdRoot     = null;//文件夹json对象
    this.lenTotal   = 0;
    this.folderInit = false;//文件夹是否初始化
    this.taskInit   = false;
    this.percent    = "0%";
    this.filesCmp	= 0;//已下载完的文件总数

    this.addTask = function (idSvr)
    {
        var id = idSvr.toString();
        for(i in this.unCmpFiles)
        {
            if (i == id) return;
        }
        this.unCmpFiles.push(id);
    };
    this.delTask = function (idSvr)
    {
        if (this.unCmpFiles.length < 1) return;
        this.unCmpFiles.remove(idSvr.toString());
    };
    this.SaveCfg = function ()
    {
        //this.pathLoc = this.Config["Folder"] + this.name;
        //this.cfgPath = this.pathLoc + ".cfg";
        this.Browser.SaveFolder(this.cfgPath, this.fdJson, this.unCmpFiles.join(","));
    };
    this.LoadCfg = function ()
    {
        //{name:"test",path:"d:\\my\\folder1.cfg",data:"文件夹JSON",unCmpFiles:"1,2,3,4,5,6,7"}
        var data = this.Browser.LoadFolder(this.cfgPath);
        if(data.length<1)return;
        var fdObj = eval("("+data+")");
        this.fdJson = fdObj.data;
        this.fdRoot = eval("(" + decodeURIComponent(fdObj.data) + ")");
        this.unCmpFiles = fdObj.unCmpFiles.split(",");
        this.fileCount  = this.fdRoot.files.length;
        this.folderInit = true;
        this.lenTotal = parseInt(this.fdRoot.length);
        this.filesCmp = this.fileCount - this.unCmpFiles.length;//计算已下载完的文件总数
            
    for (var i = 0, l = this.fdRoot.files.length; i < l; ++i)
    {
        if (this.isUnCmpFile(this.fdRoot.files[i].idSvr))
        {
            this.AddFile(this.fdRoot.files[i], i + 1);
        }
    }
};
    this.DelCfg = function ()
    {
        this.Browser.DelFdCfg(this.cfgPath);
    };
    this.isUnCmpFile = function (fid)
    {
        var v = jQuery.inArray(fid+"", this.unCmpFiles);  //3
        return v != -1;
    };

    //获取文件夹JSON数据
    this.GetFolder = function ()
    {
        $.ajax({
            type: "GET"
            //, dataType: 'jsonp'
            //, jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlFdJson"]
            , data: { fdID: _this.fdID, time: new Date().getTime() }
            , success: function (msg)
            {
                _this.fdJson = msg;
                var json = eval("(" + decodeURIComponent(msg) + ")");
                _this.fdRoot = json;
                _this.unCmpFiles = json.ids.split(",");//未下载的文件列表ID(idSvr)

                //保存配置
                _this.SaveCfg();

                _this.lenTotal = parseInt(json.length);
                if (null == json.files)
                {
                    _this.DownComplete();
                    return;
                }
                _this.fileCount = json.files.length;
                for (var i = 0, l = json.files.length; i < l; ++i)
                {
                    _this.AddFile(json.files[i],i+1);
                }
                _this.pButton.text("停止");
                _this.folderInit = true;

                _this.SvrCreate();//创建任务
            }
            , error: function (req, txt, err)
            {
                alert("向服务器发送文件夹信息错误！" + req.responseText);
                _this.folderInit = false;
                _this.pMsg.text("向服务器发送文件夹信息错误");
                _this.pButton.text("重试");
            }
            , complete: function (req, sta) { req = null; }
        });
    };

    //创建任务，在GetFolder后面调用
    this.SvrCreate = function ()
    {
        $.ajax({
            type: "GET"
            //, dataType: 'jsonp'
            //, jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlFdCreate"]
            , data: { uid: _this.Fields["uid"],name:encodeURIComponent(_this.name),fdid:_this.fdID,mac:_this.mac,pathLoc:encodeURIComponent(_this.cfgPath), time: new Date().getTime() }
            , success: function (v)
            {
                var fd = eval("(" + decodeURIComponent(v) + ")");
                _this.idSvr     = fd.idSvr; //
                _this.idSvrFD   = fd.idSvr;  //
                _this.idSvrF    = fd.idF;    //
                _this.taskInit = true;
                
                //开始上传
                _this.State = HttpDownloaderState.Posting;
                _this.Download();
            }
            , error: function (req, txt, err)
            {
                alert("向服务器发送文件夹信息错误！" + req.responseText);
                _this.pMsg.text("向服务器发送文件夹信息错误");
                _this.pButton.text("重试");
            }
            , complete: function (req, sta) { req = null; }
        });
    };
    //更新服务器文件夹进度
    this.SvrUpdate = function ()
    {
        $.ajax({
            type: "GET"
            //, dataType: 'jsonp'
            //, jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlFdUpdate"]
                , data: { uid: _this.Fields["uid"], fid: _this.idSvr, mac: _this.mac,percent:_this.percent, time: new Date().getTime() }
            , success: function (v)
            {
            }
            , error: function (req, txt, err){alert("更新文件夹进度失败！" + req.responseText);}
            , complete: function (req, sta) { req = null; }
        });
    };

    this.CreateFileUrl = function (idSvr)
    {
        return this.Config["UrlDownload"] + "?fid=" + idSvr;
    };

    this.AddFile = function (file,index)
    {
        var f = new FileDowner(this.files.length, this.CreateFileUrl(file.idSvr), this.Manager);
        f.root = this;
        f.idSvr = file.idSvr;
        f.pathRel = file.pathRel;//相对路径。root\\child\\folder\\
        f.LocalFolder = this.Config["Folder"] + "\\" + file.pathRel;//
        f.index = index;//索引
        this.files.push(f);
        this.filesMap[f.idSvr.toString()] = f;//添加到表中
    };
    //方法-准备
    this.Ready = function ()
    {
        //this.pButton.style.display = "none";
        this.pMsg.text("正在下载队列中等待...");
        this.State = HttpDownloaderState.Ready;
    };
    this.Download = function ()
    {
        //初始化文件夹数据
        if (!this.folderInit)
        {
            this.GetFolder();
        }
        else
        {
            FolderDownloader_obj = this;//
            this.State = HttpDownloaderState.Posting;
            var id = this.unCmpFiles[0];
            this.fileCur = this.filesMap[id];//
            this.fileCur.Download();
            this.pMsg.text("正在下载第" + (this.filesCmp + 1) + "/" + this.fileCount + "个文件");
            this.pButton.text("停止");
        }
    };
    this.DownNext = function ()
    {
        if (HttpDownloaderState.Stop == this.State) return;
        if (this.unCmpFiles.length > 0)
        {
            var id = this.unCmpFiles[0];
            this.fileCur = this.filesMap[id];
            this.fileCur.Download();
            this.pMsg.text("正在下载第" + this.fileCur.index + "/"+this.fileCount+"个文件");
        }//上传完成
        else
        {
            this.DownComplete();
        }
    };
    this.DownComplete = function ()
    {
        this.DelCfg();//
        this.pMsg.text("所有文件下载完毕");
        this.pProcess.css("width", "100%");
        this.pPercent.text("100%");
        this.pBtnDel.hide();
        this.pButton.hide();
        this.Manager.DelTask(this.idLoc);
        this.Manager.DelTaskWorking(this.idLoc);
        $.ajax({
            type: "GET"
            //, dataType: 'jsonp'
            //, jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlFdDel"]
            , data: { uid: _this.Fields["uid"], idF: _this.idSvrF,idFD:_this.idSvrFD, mac: _this.mac, time: new Date().getTime() }
            , success: function (v){}
            , error: function (req, txt, err){alert("删除文件夹任务错误！" + req.responseText);}
            , complete: function (req, sta) { req = null; }
        });
    };

    //方法-停止传输
    this.Stop = function ()
    {
        if (this.fileCur)
        {
            //if (this.fileCur.ATL.inited)
            {
                this.fileCur.ATL.Stop();
                this.fileCur.SvrUpdate();
            }
            //添加到队列
            this.fileCur = null;
        }
        this.State = HttpDownloaderState.Stop;
        this.pButton.text("续传");
        this.pMsg.text("下载已停止");
    };

    this.Delete = function ()
    {
        this.div.remove();
        this.spliter.remove();
    };

    this.ItemComplete = function (obj)
    {
		this.filesCmp++;
		if(!this.filesCmp)
		{
			this.percent="0%";
		}
        else
		{
			this.percent = ((this.filesCmp / this.fileCount) * 100).toFixed(2) + "%";
		}
		this.delTask(obj.idSvr);//
        //更新配置
        this.SaveCfg();
        this.SvrUpdate();//更新服务器进度
        this.pProcess.css("width", this.percent);
        this.pPercent.text(this.percent);
        obj.State = HttpDownloaderState.Complete;
        obj.ATL.Dispose();
        obj.SvrDelete();

        //需要定时执行。
        window.setTimeout(FolderDownloader_Next, 100);
        //this.DownNext();
    };
    this.ItemProcess = function (obj, speed, downLen, percent, time)
    {
        if(this.fileCur)
        {
	        var msg = "正在下载第" + (this.filesCmp+1) + "/" + this.fileCount + "个文件 进度：" + percent;
	        this.pMsg.text(msg);
        }
    };
    this.ItemError = function (obj, err)
    {
        //obj.pMsg.text(DownloadErrorCode[err]);
        //obj.pButton.text("重试");
        this.State = HttpDownloaderState.Error;
        obj.SvrUpdate();
        this.DownNext(); //继续传输下一个
    };
}

//文件下载对象
function FileDowner(fileID, fileUrl, mgr)
{
    var _this = this;
    //this.pMsg;
    //this.pProcess;
    //this.pPercent;
    //this.pButton
    //this.pFileSize
    this.root = null;//根级文件夹对象
    this.Manager = mgr;
    this.iePool = mgr.iePool;
    this.ffPool = mgr.ffPool;
    this.ActiveX = mgr.ActiveX;
    this.Config = mgr.Config;
    this.Fields = mgr.Fields;
    this.FirefoxAtl = mgr.FirefoxAtl;
    this.firefox = mgr.firefox;
    this.chrome = mgr.chrome;
    this.Browser = mgr.Browser;
    this.State = HttpDownloaderState.None;
    //attr
    this.idSvr = 0;//与服务器数据表 f_id 对应
    this.inited = false;//是否初始化（在服务器创建信息）
    this.mac = mgr.Browser.GetMacs();
    this.FileUrl        = fileUrl;
    this.FileID         = fileID;
    this.idLoc          = fileID;
    this.LocalFolder    = this.Config["Folder"];
    this.LocalFilePath  = "";//下载的本地文件完整路径。示例：D:\\Soft\\QQ2012.exe
    this.FileNameLoc    = "";//自定义文件名称
    this.pathRel        = "";
    this.index          = 0;//基于1的索引
    this.fileLenLoc     = 0;
    this.percent        = "0%";//

    //初始化控件
    this.ATL = {
        "Create": function ()
        {
            if (_this.iePool.length > 0)
            {
                this.com = _this.iePool.pop();
            }
            else
            {
                this.com = new ActiveXObject(_this.ActiveX["Down"]);
            }
            this.com.Object = _this;
            this.com.License = _this.Config["License"];
            this.com.Company = _this.Config["Company"];
            this.com.FileUrl = _this.FileUrl;
            this.com.LocalFolder = _this.LocalFolder;
            //自定义文件名称
            if (_this.FileNameLoc.length > 4)
            {
                this.com.FileName = _this.FileNameLoc;
            }//续传
            //if (_this.LocalFilePath.length > 0)
            //{
                this.com.LocalFilePath = _this.LocalFilePath;
            //}
            //event
            this.com.OnComplete = HttpDownloader_Complete;
            this.com.OnPost = HttpDownloader_Process;
            this.com.OnError = HttpDownloader_Error;
            this.com.OnConnected = HttpDownloader_Connected;
            this.com.OnGetFileSize = HttpDownloader_GetFileSize;
            this.com.OnGetFileName = HttpDownloader_GetFileName;
            this.com.OnBeginDown = HttpDownloader_BeginDown;
            this.inited = true;
        }
        , "SetFileName": function (name) { this.com.FileName = name; }
        , "SetFilePathLoc": function (path) { this.com.LocalFilePath = path; }
        //get
        , "GetFileSize": function () { return this.com.FileSize; }
        , "GetFileLengthLoc": function () { return this.com.FileLengthLoc; }
        , "GetFilePathLoc": function () { return this.com.LocalFilePath; }
        , "GetResponse": function () { return this.com.Response; }
        , "GetMD5": function () { return this.com.MD5; }
        , "GetMd5Percent": function () { return this.com.Md5Percent; }
        , "GetPostedLength": function () { return this.com.PostedLength; }
        , "GetErrorCode": function () { return this.com.ErrorCode; }
        //methods
        , "Download": function () { this.com.Download(); }
        , "Stop": function ()
        {
            if (this.inited)
            {
                this.com.Stop();
            }
        }
        , "ClearFields": function () { this.com.ClearFields(); }
        , "AddField": function (fn, fv) { this.com.AddField(fn, fv); }
        , "Dispose": function ()
        {
            _this.iePool.push(this.com);
            this.com = null;
            this.inited = false;
        }
        , "IsPosting": function () { return this.com.IsPosting(); }
        , "OpenPath": function () { this.com.OpenPath(); }
        , "OpenFile": function () { this.com.OpenFile(); }
        //property
        , "com": null
        , "FileID": 0//由控件分配的
        ,"inited":false
    };

    //Firefox 插件
    this.ATLFF = {
        "Create": function ()
        {
            if (_this.ffPool.length>0)
            {
                this.idSign = _this.ffPool.pop();
            }
            else
            {
                this.idSign = this.Atl.AddFile();
            }
            this.Atl.SetObject(this.idSign, _this);
            this.Atl.SetLocalFolder(this.idSign, _this.LocalFolder);
            this.Atl.SetFileUrl(this.idSign, _this.FileUrl);
            //自定义文件名称
            if (_this.FileNameLoc.length > 4)
            {
                this.Atl.SetFileName(this.idSign, _this.FileNameLoc);
            }//续传
            //if (_this.LocalFilePath.length > 0)
            {
                this.Atl.SetFilePathLoc(this.idSign, _this.LocalFilePath);
            }
            this.inited = true;
        }
        , "SetFileName": function (name) { this.Atl.SetFileName(this.idSign, name); }
        , "SetFilePathLoc": function (path) { this.Atl.SetFilePathLoc(this.idSign, path); }
        //get
        , "GetFileSize": function () { return this.Atl.FileSize; }
        , "GetFileLengthLoc": function () { return this.Atl.GetFileLengthLoc(this.idSign); }
        , "GetFilePathLoc": function () { return this.Atl.GetFilePathLoc(this.idSign); }
        , "GetFileLength": function () { return this.Atl.FileLength; }
        , "GetResponse": function () { return this.Atl.Response; }
        , "GetPostedLength": function () { return this.Atl.PostedLength; }
        , "GetErrorCode": function () { return this.Atl.ErrorCode; }
        //methods
        , "Download": function () { this.Atl.Download(this.idSign); }
        , "Stop": function ()
        {
            if (this.inited)
            {
                //_this.fileLenLoc = this.GetFileLengthLoc();
                this.Atl.Stop(this.idSign);
            }
        }
        , "ClearFields": function () { this.Atl.ClearFields(this.idSign); }
        , "AddField": function (fn, fv) { this.Atl.AddField(this.idSign, fn, fv); }
        , "Dispose": function ()
        {
            _this.ffPool.push(this.idSign);
            this.idSign = -1;
            this.inited = false;
        }
        , "IsPosting": function () { return this.Atl.IsPosting(this.idSign); }
        , "OpenPath": function () { this.Atl.OpenPath(this.idSign); }
        , "OpenFile": function () { this.Atl.OpenFile(this.idSign); }
        //property
        , "Atl": _this.FirefoxAtl
        , "idSign": -1//由控件分配的标识符，全局唯一。
        , "inited":false
    };
    //是Firefox或Chrome浏览器
    if (this.firefox || this.chrome) { this.ATL = this.ATLFF; }

    //方法-准备
    this.Ready = function ()
    {
        //this.pButton.style.display = "none";
        this.pMsg.text("正在下载队列中等待...");
        this.State = HttpDownloaderState.Ready;
    };

    //方法-开始下载
    this.Download = function ()
    {
        //普通文件项
        if (!this.root)
        {
            this.pButton.show();
            this.pButton.text("停止");
            this.pMsg.text("开始连接服务器...");
            this.State = HttpDownloaderState.Posting;
        }
        this.ATL.Create();
        this.ATL.Download();
    };

    this.isComplete = function () { return this.State == HttpDownloaderState.Complete; };
    this.DownProcess = function (downLen, percent, speed, time)
    {
        this.pPercent.text(percent);
        this.pProcess.css("width", percent);
        var msg = ["已下载", downLen, " 速度:", speed, "/S", " 剩余时间:", time];
        this.pMsg.text(msg.join(""));
    };
    this.DownComplete = function ()
    {
        this.pButton.text("打开");
        this.pProcess.css("width", "100%");
        this.pPercent.text("100%");
        this.pMsg.text("下载完成");
        this.State = HttpDownloaderState.Complete;
        this.Manager.DelTaskWorking(this.idLoc);
        this.Manager.DelTask(this.idLoc);
        this.Dispose();//添加到缓存
        this.SvrDelete();
        this.DownNext();
    };
    this.DownError = function (err)
    {
        this.pMsg.text(DownloadErrorCode[err]);
        this.pButton.text("重试");
        this.State = HttpDownloaderState.Error;
        this.Manager.AddTask(this.idLoc);
        this.Manager.DelTaskWorking(this.idLoc);
        this.SvrUpdate();
        this.DownNext(); //继续传输下一个
    };

    //方法-启动下一个传输
    this.DownNext = function ()
    {
        if (this.Manager.UnDownloadIdList.length > 0)
        {
            var index = this.Manager.UnDownloadIdList.shift();
            var obj = this.Manager.DownloadList[index];

            //空闲状态
            if (HttpDownloaderState.Ready == obj.State)
            {
                obj.Download();
            }
        }
    };

    //打开文件所在路径
    this.OpenPath = function ()
    {
        this.Browser.OpenPath(this.LocalFolder);
        //this.ATL.OpenPath();
    };

    //方法-停止传输
    this.Stop = function ()
    {
        if (this.ATL.inited)
        {
            this.ATL.Stop();
            this.SvrUpdate();
        }
        this.State = HttpDownloaderState.Stop;
        this.pButton.text("续传");
        this.pMsg.text("下载已停止");
    };

    this.Delete = function ()
    {
        this.div.remove();
        this.spliter.remove();
    }

    //释放内存
    this.Dispose = function ()
    {
        this.ATL.Dispose();
    };

        //在出错，停止中调用
        this.SvrUpdate = function ()
        {
            $.ajax({
                type: "GET"
                , dataType: 'jsonp'
                , jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                , url: _this.Config["UrlUpdate"]
                , data: { uid: _this.Fields["uid"], fid: _this.idSvr, mac: _this.mac, lenLoc: _this.fileLenLoc, lengthSvr: _this.fileSize, percent: _this.percent, time: new Date().getTime()}
            , success:function (msg){}
            , error: function (req, txt, err) { alert("更新下载信息失败！" +req.responseText);}
            , complete: function (req, sta) { req = null;}
            });
        };

    //在服务端创建一个数据，用于记录下载信息，一般在HttpDownloader_BeginDown中调用
    this.SvrCreate = function ()
    {
        //已记录将不再记录
        if(this.inited) return;
        if (this.idSvr) return;

        $.ajax({
            type: "GET"
            , dataType: 'jsonp'
            , jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlCreate"]
            , data: { uid: _this.Fields["uid"], mac: _this.mac, pathLoc: encodeURIComponent(_this.LocalFilePath), pathSvr: encodeURIComponent(_this.FileUrl), lengthLoc: "0", lengthSvr: _this.fileSize, time: new Date().getTime()}
            , success: function (json)
            {
                var obj = JSON.parse(decodeURIComponent(json.value));
                //var json = eval(msg);
                //json = json[0];
                _this.inited = true;
                _this.idSvr = obj.idSvr;
                //文件已经下载完
                if(_this.isComplete()){_this.SvrDelete();}
            }
            , error: function (req, txt, err) { alert("创建信息失败！" +req.responseText);}
            , complete: function (req, sta) { req = null;}
        });
    };

    //一般在HttpDownloader_Complete中调用
    this.SvrDelete = function ()
    {
        $.ajax({
            type: "GET"
            , dataType: 'jsonp'
            , jsonp: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            , url: _this.Config["UrlDel"]
            , data: { uid: _this.Fields["uid"], fid: this.idSvr, mac: _this.mac, time: new Date().getTime() }
            , success: function (json)
            {
                //var res = eval(msg);
            }
            , error: function (req, txt, err) { alert("删除数据错误！" +req.responseText);}
            , complete: function (req, sta) { req = null; }
        });
    };
}

//连接成功
function HttpDownloader_Connected(obj)
{
    obj.pMsg.text("服务器连接成功");
}

//传输完毕
function HttpDownloader_Complete(obj)
{
    //文件夹项
    if (obj.root)
    {
        obj.root.ItemComplete(obj);
    }
    else
    {
        obj.DownComplete();
    }
}

//获取文件大小
function HttpDownloader_GetFileSize(obj, size)
{
    //文件夹项
    if (obj.root)
    {
    }
    else
    {
        obj.pFileSize.text(size);
    }
    obj.fileSize = size;
}

//获取文件大小(在最后执行)
function HttpDownloader_GetFileName(obj, name)
{
    //文件夹项
    if (obj.root)
    {
    }
    else
    {
        obj.pFileName.text(name);
        obj.pFileName.attr("title", name);
    }
}

function HttpDownloader_BeginDown(obj)
{
    //文件夹项
    if (obj.root)
    {
        obj.LocalFilePath = obj.ATL.GetFilePathLoc();
        debugMsg("控件解析的路径：" + obj.LocalFilePath);
    }
    else
    {
        obj.LocalFilePath = obj.ATL.GetFilePathLoc();
        debugMsg("控件解析的路径：" + obj.LocalFilePath);
        obj.SvrCreate();//bug:下载速度快，导致还未创建就下载结束了。
    }
}

//传输进度
function HttpDownloader_Process(obj, speed, downLen, percent, time)
{
    	obj.fileLenLoc = obj.ATL.GetFileLengthLoc();//保存已下载进度
    obj.percent = percent;
    if (obj.root)
    {
        obj.root.ItemProcess(obj, speed, downLen, percent, time);
    }
    else
    {
        obj.DownProcess(downLen,percent,speed,time);
    }
}

//传输错误
function HttpDownloader_Error(obj, err)
{
    //文件夹项
    if (obj.root)
    {
        obj.root.ItemError(obj, err);
    }
    else
    {
        obj.DownError(err);
    }
}