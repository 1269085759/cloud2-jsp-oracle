package Xproer.uncomplete;

import java.util.ArrayList;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import Xproer.FolderInf;

public class uc_folder {
    public FolderInf m_fdSvr;

    public List<uc_file_child> m_files;// = new List<uc_file_child>();//子文件列表

    public uc_folder()
    {
    	this.m_files = new ArrayList<uc_file_child>();
    }

    public String getJson()
    {    	
    	JSONObject obj = JSONObject.fromObject(this.m_fdSvr);	     
        	    
        obj.put("files", JSONArray.fromObject(this.m_files));
        return obj.toString();
    }
}
