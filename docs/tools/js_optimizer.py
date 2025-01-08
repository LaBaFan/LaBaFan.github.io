# docs/tools/js_optimizer.py
import re
from pathlib import Path
import terser

class JSOptimizer:
    def __init__(self, input_dir, output_dir):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def optimize(self):
        """优化所有JS文件"""
        for js_file in self.input_dir.glob('**/*.js'):
            # 读取JS内容
            content = js_file.read_text(encoding='utf-8')

            # 优化JS
            optimized = self.optimize_js(content)

            # 保存优化后的文件
            output_file = self.output_dir / js_file.name
            output_file.write_text(optimized, encoding='utf-8')

    def optimize_js(self, content):
        """优化单个JS文件内容"""
        options = {
            'compress': {
                'pure_funcs': ['console.log'],  # 移除console.log
                'drop_debugger': True,          # 移除debugger
                'unsafe': True,                 # 启用不安全优化
                'passes': 2                     # 优化次数
            },
            'mangle': {
                'toplevel': True,              # 混淆顶级作用域
                'eval': True                   # 混淆eval中的变量
            }
        }

        # 使用terser压缩
        result = terser.minify(content, options)
        return result['code']

# 使用优化器
optimizer = JSOptimizer(
    input_dir='docs/javascripts',
    output_dir='docs/javascripts/min'
)
optimizer.optimize()