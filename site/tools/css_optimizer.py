# docs/tools/css_optimizer.py
import re
from pathlib import Path
from csscompressor import compress

class CSSOptimizer:
    def __init__(self, input_dir, output_dir):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def optimize(self):
        """优化所有CSS文件"""
        for css_file in self.input_dir.glob('**/*.css'):
            # 读取CSS内容
            content = css_file.read_text(encoding='utf-8')

            # 优化CSS
            optimized = self.optimize_css(content)

            # 保存优化后的文件
            output_file = self.output_dir / css_file.name
            output_file.write_text(optimized, encoding='utf-8')

    def optimize_css(self, content):
        """优化单个CSS文件内容"""
        # 移除注释
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)

        # 移除多余空白
        content = re.sub(r'\s+', ' ', content)

        # 压缩CSS
        content = compress(content)

        return content

# 使用优化器
optimizer = CSSOptimizer(
    input_dir='docs/stylesheets',
    output_dir='docs/stylesheets/min'
)
optimizer.optimize()