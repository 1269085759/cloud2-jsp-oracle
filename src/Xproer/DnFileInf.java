package Xproer;
import com.google.gson.annotations.SerializedName;

public class DnFileInf 
{
    public DnFileInf()
    { 
    	this.m_fdTask = false;
    }

    @SerializedName("idSvr")
    public int m_fid;

    @SerializedName("uid")
    public int m_uid;

    @SerializedName("mac")
    public String m_mac;

    @SerializedName("pathLoc")
    public String m_pathLoc;

    @SerializedName("pathSvr")
    public String m_pathSvr;

    @SerializedName("lengthLoc")
    public String m_lengthLoc;

    @SerializedName("lengthSvr")
    public String m_lengthSvr;
    
    @SerializedName("percent")
    public String m_percent;
    
    @SerializedName("name")
    public String m_name;
    
    @SerializedName("fdTask")
    public Boolean m_fdTask;//是否是文件夹
    
    @SerializedName("fdID")
    public int m_fdID;//文件夹ID
}