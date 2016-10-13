package Xproer;
import com.google.gson.annotations.SerializedName;

public class DnFolderInf 
{
    public DnFolderInf()
    { }

    @SerializedName("idSvr")
    public int m_fd_id=0;//fd_id，自动编号

    @SerializedName("uid")
    public int m_uid=0;
    
    @SerializedName("idFD")
    public int m_fdID=0;//与xdb_folders.fd_id对应

    @SerializedName("mac")
    public String m_mac="";
    
    @SerializedName("name")
    public String m_name="";

    @SerializedName("pathLoc")
    public String m_pathLoc="";
    
    @SerializedName("idF")
    public int m_idF;
}