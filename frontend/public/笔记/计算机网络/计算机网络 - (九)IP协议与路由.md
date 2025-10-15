# 计算机网络 - (九)IP协议与路由

掌握IP协议与路由算法。

---


### 9.1 子网划分

```python
class SubnetCalculator:
    """
    子网计算器
    """
    def __init__(self, ip, cidr):
        self.ip = ip
        self.cidr = cidr
    
    def ip_to_int(self, ip):
        """IP转整数"""
        parts = [int(x) for x in ip.split('.')]
        return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
    
    def int_to_ip(self, num):
        """整数转IP"""
        return f"{(num >> 24) & 0xFF}.{(num >> 16) & 0xFF}.{(num >> 8) & 0xFF}.{num & 0xFF}"
    
    def get_network_info(self):
        """获取网络信息"""
        ip_int = self.ip_to_int(self.ip)
        
        # 子网掩码
        mask_int = (0xFFFFFFFF << (32 - self.cidr)) & 0xFFFFFFFF
        mask = self.int_to_ip(mask_int)
        
        # 网络地址
        network_int = ip_int & mask_int
        network = self.int_to_ip(network_int)
        
        # 广播地址
        broadcast_int = network_int | (~mask_int & 0xFFFFFFFF)
        broadcast = self.int_to_ip(broadcast_int)
        
        # 可用主机数
        host_count = 2 ** (32 - self.cidr) - 2
        
        return {
            'IP地址': self.ip,
            'CIDR': f"/{self.cidr}",
            '子网掩码': mask,
            '网络地址': network,
            '广播地址': broadcast,
            '第一个可用IP': self.int_to_ip(network_int + 1),
            '最后一个可用IP': self.int_to_ip(broadcast_int - 1),
            '可用主机数': host_count
        }

# 示例
calc = SubnetCalculator('192.168.1.100', 24)
info = calc.get_network_info()
for k, v in info.items():
    print(f"{k}: {v}")
```

### 9.2 路由表

```python
class RoutingTable:
    """
    路由表
    """
    def __init__(self):
        self.routes = []  # [(network, netmask, gateway, interface), ...]
    
    def add_route(self, network, netmask, gateway, interface):
        """添加路由"""
        self.routes.append((network, netmask, gateway, interface))
    
    def ip_to_int(self, ip):
        parts = [int(x) for x in ip.split('.')]
        return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
    
    def match_route(self, dest_ip):
        """最长前缀匹配"""
        dest_int = self.ip_to_int(dest_ip)
        best_match = None
        best_prefix_len = -1
        
        for network, netmask, gateway, interface in self.routes:
            network_int = self.ip_to_int(network)
            mask_int = self.ip_to_int(netmask)
            
            # 检查是否匹配
            if (dest_int & mask_int) == network_int:
                # 计算前缀长度
                prefix_len = bin(mask_int).count('1')
                
                # 选择最长匹配
                if prefix_len > best_prefix_len:
                    best_prefix_len = prefix_len
                    best_match = (network, gateway, interface)
        
        return best_match

# 示例
rt = RoutingTable()
rt.add_route('192.168.1.0', '255.255.255.0', '192.168.1.1', 'eth0')
rt.add_route('192.168.0.0', '255.255.0.0', '192.168.0.1', 'eth1')
rt.add_route('0.0.0.0', '0.0.0.0', '10.0.0.1', 'eth2')  # 默认路由

print(rt.match_route('192.168.1.100'))  # 最长匹配
```

### 9.3 NAT（网络地址转换）

```python
class NAT:
    """
    NAT转换表
    """
    def __init__(self, public_ip):
        self.public_ip = public_ip
        self.nat_table = {}  # (private_ip, private_port) → public_port
        self.next_port = 10000
    
    def translate_outbound(self, private_ip, private_port):
        """内网→外网"""
        key = (private_ip, private_port)
        
        if key not in self.nat_table:
            self.nat_table[key] = self.next_port
            self.next_port += 1
        
        public_port = self.nat_table[key]
        print(f"NAT转换: {private_ip}:{private_port} → {self.public_ip}:{public_port}")
        return (self.public_ip, public_port)
    
    def translate_inbound(self, public_port):
        """外网→内网"""
        for (private_ip, private_port), port in self.nat_table.items():
            if port == public_port:
                print(f"NAT转换: {self.public_ip}:{public_port} → {private_ip}:{private_port}")
                return (private_ip, private_port)
        
        return None

# 示例
nat = NAT('203.0.113.1')
nat.translate_outbound('192.168.1.100', 5000)
nat.translate_inbound(10000)
```

---

**本章完**
