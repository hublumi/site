import Foundation
import Quartz

let url = URL(fileURLWithPath: "/Users/pm/Downloads/POSICIONAMENTO — HUB LUMI.pdf")
if let pdf = PDFDocument(url: url) {
    var text = ""
    for i in 0..<pdf.pageCount {
        if let page = pdf.page(at: i) {
            text += page.string ?? ""
        }
    }
    print(text)
}
